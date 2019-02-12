export const FinancialsConstants = Object.freeze({
  buttons: {
    search: 'Search'
  },

  text: {
    landingPageTitle: 'My Financials',
    landingPageTransactionTitle: 'All Transactions',
    collectionHeaderTitle: 'Account(s)',
    collectionlinkTitle: 'Quick Links',
    accountDetailTitle: 'About Our Accounts',
    acountDetailsDateTitle: 'Effective Date',
    chart1: 'Chart1',
    chart2: 'Chart2',
    chartHeader1: 'Available Balance',
    chart1Param1Text: 'Available',
    chart1Param2Text: 'Spent',
    chartHeader2: 'Annual Election',
    chart2Param1Text: 'Payroll Deposits YTD',
    chart2Param2Text: 'Remaining Payroll Deposits',
    chart2BarColor: '#8FBE48',
    accountDetailRightTopAccordionHeader: 'Family Details',
    accountDetailRightTopAccordionContent: 'The following family members are linked to this account.',
    accountDetailRightDeductibleAccordionHeader: 'Deductible Status',
    accountDetailRightDeductibleAccordionContent1: 'Deductible',
    accountDetailRightDeductibleAccordionContent2: 'Deductible Applied',
    accountDetailRightDeductibleAccordionContent3: 'Deductible Remaining',
    accountDetailRightBottomAccordionHeader: 'Deadlines',
    accountDetailRightBottomAccordionContent1: 'Plan Start Date',
    accountDetailRightBottomAccordionContent2: 'Last Day for Spending',
    accountDetailRightBottomAccordionContent3: 'Last Day to Submit Claims',
    allTransactionsTitle: 'All Transactions',
    allTransactionActionitems: 'Action Item(s)',
    allTransactionPending: 'Pending',
    allTransactionCompleted: 'Completed',
    allTransactionOthers: 'Others',
    amountPaid: 'Amount PAID',
    whatYouOwe: 'What You Owe',
    dateOfTransaction: 'Date of Transaction:',
    claimNo: 'ClaimNo.',
    transactionDetailTitle: 'Transaction Details',
    makePayment: 'Make Payment',
    actionDescTransactDetails: 'This is a description that supports the status of a claim. Typically it is associated with a denied claim.',
    dateOfService: 'Date of Service:',
    totalBillingBreakdown: 'Total Billing Breakdown',
    amountChargedByHealthcareProvider: 'Amount charged by health care provider',
    amountAllowed: 'Amount allowed',
    amountCovered: 'Amount covered',
    yourTotalResponsibility: 'Your total responsibility',
    amountYouPaidoutOfPocket: 'Amount you paid Out-of-Pocket',
    amountYourBenefitAccountPaid: 'Amount your benefit account paid',
    billingBreakdownByService: 'Billing Breakdown By Service',
    serviceType: 'Service Type',
    pleaseConfirmountofPocketPaidAmount: 'Please confirm your Out-of-Pocket Paid Amount',
    PaymentDetailsAdjudication: 'Payment Details (Adjudication)',
    paymentDetails: 'Payment Details',
    payment: 'Payment:',
    account: 'Account',
    previouslyPaid: 'Previously Paid',
    paidTo: 'Paid To',
    paymentDate: 'Payment Date',
    paymentMethod: 'Payment Method',
    checkTrace: 'Check/Trace #',
    adjudicationDetails: 'Adjudication Details',
    totalCharges: 'Total Charges',
    pended: 'Pended',
    denied: 'Denied',
    excluded: 'Excluded',
    eligible: 'Eligible',
    appiledtoUpFrontDeductible: 'Appiled to Up Front Deductible',
    offset: 'Offset',
    employeePaid: 'Employee Paid',
    onHold: 'On Hold',
    approved: 'Approved',
    viewClaims: 'View in My Claims',
    partiallyPaid: 'This claim is partially paid',
    reimbursementDate: 'Reimbursement Date',
    reimbursementMethod: 'Payment Method',
    hsaType: 'HSA Type',
    hsaPositingDate: 'HSA Posting Date',
    makePaymentTitle: 'Make Payment',

  },

  quickLinks: [
    {
      'text': 'Make Payment'
    },
    {
      'text': 'Schedule Payment'
    },
    {
      'text': 'Manage Bank Accounts'
    },
    {
      'text': 'Manage Debit Cards'
    },
  ],

  components: {
    financialComponent: 'FinancialsComponent',
    financialAccountDetailComponent: 'FinancialAccountDetailComponent',
    allTransactionsComponent: 'AllTransactionsComponent',
    filterSearchAllTransactionComponent: 'FilterSearchAllTransactionsComponent',
    documentsComponent: 'NoTransactionFound',
    transactionsDetailComponent: 'TransactionDetailsComponent',
  },


  labels: {

  },

  messages: {

  },

  flags: {
    transactionMode: 'transaction',
    noSearchResultsMode: 'noSearchResultsMode',
    All: 'ALL'
  },

  methods: {
    onSearch: 'onSearch',
    constructor: 'constructor',
    clearCache: 'clearCache',
    ngOnInit: 'ngOnInit',
    ngOnChanges: 'ngOnChanges',
    getAccountSummary: 'getAccountSummary',
    navigateToAllTransaction: 'navigateToAllTransactionnavigateToAllTransaction',
    accountDetail: 'accountDetail',
    getAccountDetail: 'getAccountDetail',
    getAllTransactionsSummary: 'getAllTransactionsSummary',
    convertAccountDetailIntoLineChartOptions: 'convertAccountDetailIntoLineChartOptions',
    createSearchCriteria: 'createSearchCriteria',
    showTransactionDetails: 'showTransactionDetails',
    navigateToTransactionDetail: 'navigateToTransactionDetail',
    getTransactionDetail: 'getTransactionDetail',
    financialSummaryInfo: 'financialSummaryInfo'
  },

  errorMessages: {
    invalidParamInFunctionCall: 'Function call uses invalid parameter',
    possibleInvalidParamInFunctionCall: 'Possible invalid parameters in function call',
    invalidFolderLocation: 'Invalid Folder Location',
    invalidMethodCall_invalidObj: 'Invalid method call - object is invalid',
    invalidMethodCall_invalidObjOrInstance: 'Invalid method call - object or instance param is invalid',
    invalidServiceResponseData: 'Invalid Service Response Data',
    noDocsFound_InvalidComponentModeError:
      'Invalid component mode in NoDocumentsFoundComponent. Should be one of uploads/documents/messages',
    noTransactionFound: 'No Transactions Found'
  },

  services: {
    financialsLandingPageService: 'FinancialsLandingPageService',
    financialAccountDetailService: 'FinancialAccountDetailService',
    alltransactionsService: 'AlltransactionsService',
    transactionDetailsService: 'TransactionDetailsService',
    financialResolverService: 'FinancialResolverService',
  },

  filters: {
    sortByFilters: {
      mostRecent: 'Most Recent',
      oldestFirst: 'Oldest First',
      unreadFirst: 'Unread First'
    },
    dateFilters: {
      last30Days: 'Last 30 Days',
      last60Days: 'Last 60 Days',
      last90Days: 'Last 90 Days',
      yearToDate: 'Year-to-date',
      allDates: 'All dates',
      customDateRange: 'Custom Date Range'
    }
  },

  urls: {
    accountDetailsUrl: '/participant/accounts/details',
    accountSummaryUrl: '/participant/accounts/summary',
    getAllTransactionsUrl: '/participant/transactions/recent?participantId=050754447&flexaccountkey=3820',
    getTransactionDetailsUrl: '/participant/transactions/getAlegeusTransactionsSummary',
  },

  jsonurls: {
    accountDetailsUrl: '/assets/data/financials/getAccountDetails.json',
    accountSummaryUrl: '/assets/data/financials/financialSummarySwagger.json',
    getAllTransactionsUrl: '/assets/data/financials/getAlegeusTransactionsSummary_22Aug.json',
    getTransactionDetailsUrl: '/assets/data/financials/getAlegeusTransactionsDetailTransaction.json',
  },


  api: {
    switchToApiUrlFromJsonFile: false,
    Url: 'https://myblueapi.us-east-1.elasticbeanstalk.com',
  },



});

