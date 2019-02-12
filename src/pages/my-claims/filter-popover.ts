import { Component, OnDestroy } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { UserContextProvider } from '../../providers/user-context/user-context';
import { ConfigProvider } from '../../providers/config/config';

declare var scxmlHandler: any;
@Component({
    selector: 'page-claimsFilter-popover',
    templateUrl: 'filter-popover.html'
})
export class MyClaimsFilterPopoverPage implements OnDestroy {

    visitTypesHidden: boolean = true;
    memberListHidden: boolean = true;
    sortByOption: string = "mostRecent";

    memberList: Array<any>;
    visitTypes: Array<any>;
    constructor(public viewCtrl: ViewController, public config: ConfigProvider, private userContext: UserContextProvider) {
        let navparams = this.viewCtrl.getNavParams();
        this.memberList = navparams.get('memberList');
        this.visitTypes = navparams.get('visitType');
        this.sortByOption = navparams.get('sortByOption');
        this.userContext.setIsPopoverActive(true);
    }

    ngOnDestroy() {
        this.userContext.setIsPopoverActive(false);
    }

    toggleList(listType: string, event) {
        scxmlHandler.playSoundWithHapticFeedback();
        if (listType == "visitTypes") {
            this.memberListHidden = true;
            this.visitTypesHidden = this.visitTypesHidden ? false : true;
        } else if (listType == "members") {
            this.visitTypesHidden = true;
            this.memberListHidden = this.memberListHidden ? false : true;
        }
        event.cancelBubble = true;
    }
    selectMember(item: any) {
        scxmlHandler.playSoundWithHapticFeedback();
        item.selected = true;
        let filterOption = { key: 'member', value: item.name }
        this.viewCtrl.dismiss(filterOption);
    }

    selectVisitType(item: any) {
        scxmlHandler.playSoundWithHapticFeedback();
        let filterOption = { key: 'visitType', value: item.type }
        this.viewCtrl.dismiss(filterOption);
    }

    sortBy(sortType: string) {
        scxmlHandler.playSoundWithHapticFeedback();
        let filterOption = { key: 'showByDateOrder', value: sortType }
        this.viewCtrl.dismiss(filterOption);
    }
    resetFilters() {
        let filterOption = { key: 'resetFilters', value: "" }
        this.viewCtrl.dismiss(filterOption);
    }
}