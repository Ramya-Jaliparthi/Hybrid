import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { FinancialsConstants } from '../constants/financials.constants';
import { FinancialsService } from '../common/financials-service';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { FinancialsAccountSummaryDetailsRequestModelInterface } from '../modals/interfaces/financials_summary.interface';
import { FinancialsAccountSummaryDetailsRequestModel } from '../modals/financials_summary_response.model';
import { MyPlanInfoPage } from '../../my-plan/my-plan-info';
import { ConstantsService } from "../../../providers/constants/constants.service";
declare var scxmlHandler: any;

@Component({
    selector: 'page-financial-account-details',
    templateUrl: 'financial-account-details.html',
})
export class FinancialAccountDetailsPage {

    private financeBalanceData: any;
    private financeDataResponse: any;
    private selectedAccountType: string = '';
    private selectedPlanYear: number;
    private selectedStartDate: string = '';
    private selectedEndDate: string = '';
    private header: string = '';
    private firstBarColorCls = 'barGreenCls';
    private secondBarColorCls = 'barGreyCls';
    private secondBarLabelColorCls = 'barlightGreenCls';
    private bardimGreenCls = 'bardimGreenCls';
    public barChartOptions: any = null;
    public financialDetail: Array<any> = [];
    public financialDetailIcon: Array<any> = [];
    public _financialsAccountSummaryDetailsRequestModelInterface: FinancialsAccountSummaryDetailsRequestModelInterface;
    public financialsAccountSummaryDetailsRequestModel: FinancialsAccountSummaryDetailsRequestModel;
    public _financialsService: FinancialsService;
    public chartColors: any[] = [
        {
            backgroundColor: '#3DA148',
            borderColor: '#000',
        },
        {
            backgroundColor: '#92278F ',
            borderColor: '#000',
            borderWidth: 0
        },
        {
            backgroundColor: '#B2B2B2',
            borderColor: '#8C8B8C',
            borderWidth: 1
        }
    ];
    public barChartType: string = 'horizontalBar';
    public barChartLegend: boolean = false;
    public barChartData: any[] = [
        { data: [2500], label: 'Available' },
        { data: [2950], label: 'Invested' },
        { data: [2250], label: 'Balance' },
        { data: [2250], label: 'Series D' }
    ];
    public startPosition: number = 0;

    /* Rules for filter values for years
      Current - 1
      Previous - 2
      Future - 3
    */
    constructor(public financeService: FinancialsService, private authService: AuthenticationService,
        public navParams: NavParams, public navCtrl: NavController) {
        this.selectedAccountType = navParams.get('data');
        this.selectedPlanYear = navParams.get('planYear');
        this.selectedStartDate = navParams.get('planStartDate');
        this.selectedEndDate = navParams.get('planEndDate');
        console.log(`selectedAccountType - ${this.selectedAccountType} and planYear - ${this.selectedPlanYear} 
        and selectedStartDate - ${this.selectedStartDate} and selectedEndDate - ${this.selectedEndDate}`);

        const financialRequest: FinancialsAccountSummaryDetailsRequestModelInterface = new FinancialsAccountSummaryDetailsRequestModel();
        financialRequest.planyear = 0;
        financialRequest.useridin = this.authService.useridin;
        let reqMask = this.authService.showLoadingMask('Accessing Financials Account Details...');
        this.financeService.getFinancialsAccountsSummaryDetail(financialRequest, reqMask).subscribe(resp => {
            this.financeDataResponse =  resp && resp['algmsg'] && resp['algmsg'] ? resp['algmsg']:  resp;;
            
            console.log(this.financeDataResponse);
            // added && item.planYear === 1 to display current year data  --- TEMP FIX && item.planYear === 1
            this.financeBalanceData = this.financeDataResponse.filter((item) =>
                (item.accountType === this.selectedAccountType && item.planYear === this.selectedPlanYear && item.planStartDate === this.selectedStartDate && item.planEndDate === this.selectedEndDate))
                .map((item) => {
                    return this.transfromFinancalChartData(item);
                });
            if (this.financeBalanceData && this.financeBalanceData.length > 0) {
                this.header = this.financeService.getfinancialHeaderText(this.financeBalanceData[0].accountType);
            }

            console.log(this.financeBalanceData);
        });

        //bar chart options
        this.barChartOptions = {
            scaleShowVerticalLines: false,
            scaleShowLabels: false,
            responsive: false,
            hover: {
                mode: false,
                animationDuration: 0
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    display: false,
                    ticks: {
                        beginAtZero: false,
                        callback: label => `T${label}`
                    }
                }],
                yAxes: [{
                    stacked: true,
                    barThickness: 25,
                    display: false,
                }]
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            animation: {
                duration: 0,
                onComplete: function () {
                    return;
                }
            },
            tooltips: { enabled: false }
        };
    }

    transfromFinancalChartData(item) {
        // 3 objects for 3 colors
        const chartData = [
            [
                {
                    "label": "Available",
                    "data": [1],
                    "value": item.balance ? item.balance : 'No Data',
                    "currYear": this.getCurrYear(item) ? this.getCurrYear(item) : ''
                },
                {
                    "label": "Investment",
                    "data": [0],
                    "value": item.availableRollover ? item.availableRollover : 'No Data',
                    "roolOverYear": this.getRollOverYear(item) ? this.getRollOverYear(item) : ''
                },
                {
                    "label": "Spent",
                    "data": [0],
                    "value": item.payments ? item.payments : 'No Data',
                }
            ],
            [
                {
                    "label": "Available",
                    "data": [1],
                    "value": item.contributionsYTD ? item.contributionsYTD : 'No Data',
                    'width': this.setWidth1('available1', item)
                },
                {
                    "label": "Spent",
                    "data": [0],
                    "value": item.remainingContributions ? item.remainingContributions : 'No Data',
                    'width': this.setWidth1('spent1', item)
                }
            ]
        ];

        if (!Array.isArray(item.familyDetailInfo)) {
            item.familyDetailInfo = [item.familyDetailInfo];
        }

        return {
            ...item,
            chartData
        };
    }

    getCurrYear(item) {
        const currentYear = new Date().getFullYear();
        let currentyear;
        if (item.planYear === 1) {
            currentyear = currentYear;
        }
        if (item.planYear === 2) {
            currentyear = currentYear - 1;
        }
        return currentyear;
    }

    getRollOverYear(item) {
        const currentYear = new Date().getFullYear();
        let rolloveryear;
        if (item.planYear === 1) {
            rolloveryear = currentYear - 1;
        }
        if (item.planYear === 2) {
            rolloveryear = currentYear - 2;
        }
        return rolloveryear;
    }

    setWidth(type, width) {
        let percentage = this.calculateWidthPercentage(type, width) - 20;
        let styles = {
            'width': "" + percentage + "%"
        };
        this.startPosition = percentage;
        return styles;
    }

    setWidth1(type, width) {
        let percentage = this.calculateWidthPercentage(type, width) > 20 ? this.calculateWidthPercentage(type, width) - 20 : this.calculateWidthPercentage(type, width);
        let styles = {
            'width': "" + percentage + "%"
        };
        this.startPosition = percentage;
        return styles;
    }


    calculateWidthPercentage(type, width) {
        let bal, percentage;
        if (type === 'available') {
            // bal = width.availBalance - (width.availableRollover + width.payments);
            bal = (((width.availBalance / (width.availBalance + (width.availableRollover ? width.availableRollover : 0) + width.payments)) * 100));
            // return width1;
        }
        //  if (type === 'rollOver') {
        // bal = width.availBalance - width.availableRollover;
        // bal = ((((width.availableRollover ? width.availableRollover : 0) / (width.availBalance + (width.availableRollover ? width.availableRollover : 0) + width.payments)) * 100)) + (((width.availBalance / (width.availBalance + (width.availableRollover ? width.availableRollover : 0) + width.payments)) * 100));
        // return width2;
        //}
        if (type === 'spent') {
            // bal = width.availBalance - width.availableRollover;
            bal = ((((width.payments ? width.payments : 0) / (width.availBalance + (width.availableRollover ? width.availableRollover : 0) + width.payments)) * 100)) + (((width.availBalance / (width.availBalance + (width.availableRollover ? width.availableRollover : 0) + width.payments)) * 100));
            // return width2;
        }
        if (type === 'spent1') {
            // bal = width.availBalance - width.availableRollover;
            bal = ((((width.remainingContributions ? width.remainingContributions : 0) / (width.contributionsYTD + width.remainingContributions)) * 100)) + (((width.contributionsYTD / (width.contributionsYTD + width.remainingContributions)) * 100));
            // return width2;
        }
        if (type === 'available1') {
            // bal = width.availBalance - (width.availableRollover + width.payments);
            bal = (((width.contributionsYTD / (width.contributionsYTD + width.remainingContributions)) * 100));
            // return width1;
        }
        return bal;
    }

    convertDate(date) {
        if (date) {
            return moment(date, 'YYYYMMDD').format();
        } else {
            return '';
        }
    }

    toggleFinancialDetail(index: any) {
        if (this.financialDetail[index] || this.financialDetail[index] == undefined) {
            this.financialDetail[index] = false;
            this.financialDetailIcon[index] = "arrow-up";
        } else {
            this.financialDetail[index] = true;
            this.financialDetailIcon[index] = "arrow-down";
        }
    }


    goToPlanInfoPage() {
        let etarget = 'MyPlan.InformationIconModal';
        let edataobj = { "context": "action" };
        scxmlHandler.addAnalyticEvent(ConstantsService.EVENT_APP_CLICK + etarget, edataobj);
        scxmlHandler.playSoundWithHapticFeedback();
        this.navCtrl.push(MyPlanInfoPage);
    }

    getStatus(status?) {
        if (status.toString() === '1') {
            return 'Active';
        } else if (status.toString() === '2') {
            return 'Inactive';
        } else if (status.toString() === '3') {
            return 'Temporarily';
        } else if (status.toString() === '0') {
            return 'All';
        } else {
            return '-';
        }
    }

}
