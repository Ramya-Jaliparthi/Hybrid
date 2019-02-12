export class ConstantsService {

    static LOGIN_SUCCESS: string = "LOGIN_SUCCESS";
    static REGISTER_SUCCESS: string = "REGISTER_SUCCESS";
    static LOGOUT_SUCCESS: string = "LOGOUT_SUCCESS";
    static SESSION_EXPIRED: string = "SESSION_EXPIRED";
    static RE_LOGIN: string = "RE_LOGIN";
    static IS_DASHBOARD: boolean = true;
    static REGISTER_TYPE: string = "";
    static REGISTERED_NOT_VERIFIED: string = "REGISTERED-NOT-VERIFIED";
    static REGISTERED_AND_VERIFIED: string = "REGISTERED-AND-VERIFIED";
    //static AUTHENTICATED_NOT_VERIFIED: string = "ACTIVE-AUTHENTICATED-NOT-VERIFIED";
    static AUTHENTICATED_NOT_VERIFIED: string = "AUTHENTICATED-NOT-VERIFIED";
    //static ACTIVE_AUTHENTICATED_USER: string = "ACTIVE-AUTHENTICATED-AND-VERIFIED";
    static ACTIVE_AUTHENTICATED_USER: string = "AUTHENTICATED-AND-VERIFIED";
    static APP_UNAVAILABLE_404: string = "APP_UNAVAILABLE_404";

    // internal APP events
    static APP_EVENT_SSN_UPDATED: string = "APP_EVENT_SSN_UPDATED";
    static APP_EVENT_PASSCODE_VERIFIED: string = "APP_EVENT_PASSCODE_VERIFIED";
    static APP_EVENT_LN_UPDATED: string = "APP_EVENT_LN_UPDATED";

    static EVENT_HANDLING_TIMEOUT: number = 500;
    static EVENT_HANDLING_TIMEOUT_600: number = 600;

    static TXN_ID_APP_IDENTIFIER: string = "APP_v3.0_";
    static FINANCIALS_ACCOUNT_NAMES: any = {
        "FSA": "Flexible Spending Account",
        "HRA": "Health Reimbursement Arrangement",
        "HSA": "Health Savings Account"
    }

    static REGISTRATION_TYPE_ALTERNATE_LABEL: any = {
        "EMAIL": "Use mobile number instead",
        "MOBILE": "Use email instead"
    }

    // Error messages
    static EMPTY_REQUIRED_FIELD_MESSAGE: string = "All required fields must be completed to continue.";
    static INVALID_NAME_ERROR: string = "Invalid Name, please try again";
    static INVALID_DOB_ERROR: string = "Invalid Date of Birth, please try again";
    static INVALID_MOBILE_NUMBER_ERROR: string = "Invalid mobile number, please try again";
    static INVALID_EMAIL_ERROR: string = "Invalid email address, please try again"
    static TERMS_AND_CONDITIONS: string = "Please read and accept the Terms and Conditions.";
    static EVENT_APP_SCREEN: string = "AppScreen.";
    static EVENT_APP_CLICK: string = "AppClick.";
    static EVENT_APP_DISPLAY: string = "AppDisplay.";
    static EVENT_APPERROR_API: string = "AppError.API";
    static EVENT_APPERROR_CLIENT: string = "AppError.Client";
    static MSG_CTR_LINK: string = "CTA: Opens ";
    static DRUPAL_LINK: string = "https://";

    // user states
    static USER_STATES: string[] = ['REGISTERED-NOT-VERIFIED', 'REGISTERED-AND-VERIFIED', 'ACTIVE-AUTHENTICATED-NOT-VERIFIED', 'ACTIVE-AUTHENTICATED-AND-VERIFIED'];
    static ADOBE_TAGS_FOR_USER_STATES: string[] = ['registered non-verified', 'registered verified', 'authenticated non-verified', 'authenticated verified'];
    static TIME_OUT_MESSAGE: string = "Your attempt has timed out. Please try again.";
    static ERROR_MESSAGE_LN_MAX_ATTEMPT: string = "You have reached the maximum of attempts to answer the security questions. Please enter your social security number or student ID.";
    static ERROR_MESSAGE_LN_SECOND_ATTEMPT: string = "Your answers don't match our records. Please attempt to answer the questions again. Or enter your social security number or your student ID.";
    static FAILED_QUES_COUNT: number = 0;
    static LN_FAILURE_ATTEMPT_FIRST: string = "The information you entered doesn't match our records. Please try again, or enter your Social Security number to verify your information.";
    static LN_FAILURE_ATTEMPT_SECOND: string = "The information you entered doesn't match our records. Please enter your Social Security number below to verify your information.";
    static LN_MEMBER_NOT_FOUND: string = "The information you entered doesn't match our records. Please try again, or call Member Service at <a href=\"tel:8887721722\">1-888-772-1722</a> , Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.";
    static LN_SERVER_ERROR: string = "We're currently experiencing technical difficulties. Please try again later, or call Member Service at <a href=\"tel:8887721722\">1-888-772-1722</a>.";
    static EXCEEDCOUNT_FAILURE_MESSAGE: string = "You have exceeded the maximum number of attempts to verify your identity. Please try again after 24 hours. In order to further assist you , contact us at <a href=\"tel:8887721722\">1-888-772-1722</a> and refer to code 'App Auth Lock.' ";
    static LN_SERVER_UNAVAILABLE = "This service is currently unavailable. Please try a different authentication method.";
    static LN_UNABLE_TO_ACCESS_SECURITY_QUESTIONS = "We're unable to access your security questions. Please try a different authentication method.";
    static LN_INFORMATION_DOESNOT_MATCH = "The information you entered doesn't match our records. Please try again.";
    static MISMATCH_ACCESSCODE: string = "The access code you entered does not match our records. Please try again.";
    static MEM_RECORDMSG: string = "We couldn't find your member record based on the information provided. Please call Member Service at <a href='tel:8887721722'>1&#8209;888&#8209;772&#8209;1722</a> Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.";


    static SSN_INVALID_RECORD = "The number you entered does not match our records. Please try again, or call Member Service at <a href=\"tel:8887721722\">1-888-772-1722</a>, Monday through Friday, 8:00 a.m. to 6:00 p.m. ET."

    static STD_ID_RES_5: string = "The information you entered doesn't match our records. Please try again, or call Member Service at <a href=\"tel:8887721722\">1-888-772-1722</a> Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.";
    static SSN_RES_5: string = "The information you entered doesn't match our records. Please try again.";
    static FORGOTUSERNAME_INFONOTMATCHRECORDS = "The information you entered doesn't match our records. Please try again, or call Member Service at <a href=\'tel:8887721722\'>1-888-772-1722</a> Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.";
    static FORGOTUSERNAME_NEEDINFOFIRST = "Let's get that recovered for you. We'll need a little bit of information first.";
    static FORGOTUSERNAME_WEHAVEFOUNDMATCH = "We want to protect your information, and make sure it's really you.";
    static FORGOTPSWD_LETS_SETUP_NEWPSWD = "Great! You're almost there. Let's set up a new password for you.";
    static LOGIN_CREATE_MYBLUE_ACCOUNT = "Create a MyBlue Account to access your personal and plan information.";
    static LOGIN_CHECK_EMAIL_OR_MOBILENO = "Please check your email account or mobile number for your username.";
    static REGISTRATION_WISHTO_RECEIVE_HEALTHINFO = "Yes, I wish to receive health-related information from Blue Cross Blue Shield of Massachusetts ";
    static REGISTRATION_IHAVE_READ_AND_AGREE = 'By clicking \"Continue\" I agree to the Blue Cross Blue Shield of Massachusetts ';
    static REGISTRATION_PSWD_FORMAT = " 8 or more characters, 1 number, 1 uppercase letter, 1 special character, no spaces";

    static ERROR_MESSAGES: any = {
        LOGINPAGE_ERRORMESSAGE: "For security, Touch ID and Remember Me have been disabled",
        LOGINPAGE_REMEMBER_REENABLE: "You will need to re-enable them on your next sign in.",
        LOGINPAGE_REMEMBER_DISABLE: "For security, Remember Me has been disabled",
        LOGINPAGE_REENABLE: "You will need to re-enable it on your next sign in.",
        LOGINPAGE_ERRORHEADER: "Error",
        LOGINPAGE_ERRORHEADER_CAPS: 'ERROR',
        LOGINPAGE_ERRORHEADER_SMALL: "error",
        LOGINPAGE_ERRORBODY: "There was an error during login. Please try again.",
        LOGINPAGE_RESET_REM_TOUCH: "For security, 'Touch ID' and 'Remember Me' have been reset",
        LOGINPAGE_REMEMBER_RESET: "For security, 'Remember Me' has been reset",
        LOGINPAGE_NEEDTOREREGISTER: "For enhanced security, existing MyBlue App users will need to re-register. We apologize for the inconvenience.",
        LOGINPAGE_INVALIDSECURITYTOKEN: 'Login Error - Invalid Security Token',
        LOGINPAGE_TOUCHIDENABLE: "<b>Touch ID will be enabled on your next sign in</b>",
        LOGINPAGE_FACEIDENABLE: "<b>Face ID will be enabled on your next sign in</b>",
        LOGINPAGE_TOUCHID_TEMP_DISABLE: "For security, Touch ID has been temporarily disabled. Touch ID will be re-enabled on your next sign-in.",
        LOGINPAGE_FACEID_TEMP_DISABLE: "For security, Face ID has been temporarily disabled. Face ID will be re-enabled on your next sign-in.",
        LOGINPAGE_TOUCHID_NOTSUPPORTED: "Touch ID is not supported on your device.",
        LOGINPAGE_UN_BEFORE_TOUCHID: "Please enter User Name before using Touch ID.",
        LOGINPAGE_FINGERPRINTFAILED: "Fingerprint scan failed. Please login with your username and password.",
        LOGINPAGE_TOUCHID_CHANGE: "We've detected a change to your Touch ID settings on this device. For your security, please sign in with your username and password.",
        LOGINPAGE_TOUCHID_NO_SETUP: "Touch ID is not set up on your device. Please go to your device settings and set up Touch ID.",
        LOGINPAGE_TOUCHID_DISABLED: "Fingerprint not recognized. Please log in with your username and password.",
        LOGINPAGE_TOUCHID_CHANGE_DETECT: "We've detected a change to your Touch ID settings on this device. Saving of your Touch ID was canceled.",
        LOGINPAGE_MEMPROFILE_UPDATE_ERROR: "Error while updateMemberProfile - Server encountered error processing your request",
        LOGINPAGE_SERVER_ERROR: 'Server encountered error processing your request',

        SSN_AUTH_UNABLETOREGISTER: "We're sorry. We are unable to complete your registration for this site. If you would like to check your claims or order ID card replacements, please sign in or register for the Federal Employee Program website.",
        SSN_AUTH_EXCEED_SSN_AUTH_COUNT: "You've exceeded the maximum number of attempts to verify your account. Try again in 24 hours, or call Member Service at <a href=\"tel:8887721722\">1-888-772-1722</a> Monday through Friday, 8:00 a.m. to 6:00 p.m. ET. and mention \"Authentication Lock.\"",
        SSN_AUTH_EXCEED_STUDENTID_AUTH_COUNT: "You've exceeded the maximum number of verification attempts. Try again in 24 hours, or call Member Service at <a href=\"tel:8887536615\">1-888-753-6615</a>. Monday through Friday, 8:00 a.m. to 6:00 p.m. ET and mention \"Student Authentication Lock\".",
        SSN_AUTH_EXCEED_LN_AUTH_COUNT: "You've exceeded the maximum number of verification attempts. Try again in 24 hours, or call Member Service at <a href=\"tel:8887721722\">1-888-772-1722</a> Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.",

        FORGOTPSWD_ACCOUNTLOCKED: "Your account has been locked.",
        FORGOTPSWD_INCORRECTLOGIN: "There have been too many incorrect log in attempts. <br/>  <br/> Please call Member Service at 866-822-0670 <br/> 8:00AM - 9:00PM ET, Monday - Friday.",
        FORGOTPSWD_INCORRECTLOGIN_ANCHOR: "There have been too many incorrect log in attempts. <br/>  <br/> Please call Member Service at <a  href='tel:866-822-0670'>866-822-0670</a> <br/> 8:00AM - 9:00PM ET, Monday - Friday.",
        FORGOTPSWD_INCORRECTLOGIN_NOTAG: "There have been too many incorrect log in attempts.Please call Member Service at 866-822-0670.8:00AM - 9:00PM ET, Monday - Friday.",
        FORGOTPSWD_VERIFICATION_RESENT: "<b>Verification resent!</b>",
        FORGOTUNAME_VERIFICATION_RESENT: "Verification resent!",
        FORGOTUNAME_VERIFICATION_RESENT_BODYTXT: "You may need to check your spam folder.",
        FORGOTPSWD_INVALID_SEC_TOKEN: 'Error - Invalid Security Token',
        FORGOTPSWD_VERIFICODE_EXPIRED: "Your verification code has expired.<br><span class='alertSpanLinkCls'>Get a new one</span>",
        FORGOTPSWD_SERVERERR_ACCESSCODEVERIFI: 'Server encountered error in Access Code Verification',
        FORGOTPSWD_VERIFICODE_EXPIRED_NOTAG: 'Your verification code has expired.Get a new one',
        FORGOTPSWD_RESEND_VERIFICATION_SUCCESS:'You may need to check your span folder.',
        FORGOTPSWD_APIERROR : "We couldn't find your information. Please try again. If you don't have an account, <span  class='alertSpanLinkCls'> Register Now.</span>",
        FORGOTPSWD_APIERROR_DUP : "We couldn't find your information. Please try again. If you don't have an account, Register Now.",

        FORGOTUNAME_INVALID_SEC_TOKEN: 'Error - Invalid Security Token',
        FORGOTUNAME_MAX_ATTEMPTS: "You've exceeded the maximum number of attempts. Try again in 24 hours, or call Member Service at <a href=\"tel:8887721722\">1-888-772-1722</a> Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.",
        FORGOTUNAME_INVALID_DOB: "The information you entered doesn't match our records. Please try again, or call Member Service at <a href=\"tel:8887721722\">1-888-772-1722</a> Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.",
        MEMBERINFO_AC_ALREADYEXISTS: 'An account already exists for this member ID number. Please <span class="alertSpanLinkCls" #alertLinkId>sign in</span> or try again with a new number.',
        MEMBERINFO_AC_ALREADYEXISTS_WITHOUTSIGNIN: 'An account already exists for this member ID number. Please sign in or try again with a new number.',
        MEMBERINFO_SERVER_ERROR: 'Server encountered error processing your request',

        MESSAGECENTER_NO_ALERTSTODISP: "You have no notifications or alerts to display",
        MESSAGECENTER_TECHNICAL_DIFFICULTIES: "We're currently experiencing technical difficulties. Please try again later, or call <a href=\"tel:8887721722\">1-888-772-1722</a> for immediate assistance.",
        MESSAGECENTER_YOU_HAVE_NO_NEW_NOTIFICATIONS: "You have no new notifications.",

        MYCARDS_DEPENDENTSPOPOVER_INF_NOTAVAIL: "Sorry, your dependent's information is not available at the moment, please try again later.",

        MYCARDS_FEATURE_NOTAVAIL: "Sorry this feature is not available at the moment, please try again later. ",
        MYCARDS_SERVER_ERROR: 'Server encountered error processing your request',

        MYCLAIMDETAILS_FEATURE_NOTAVAIL: "Sorry this feature is not available at the moment, please try again later. ",

        MYCLAIMS_FEATURE_NOTAVAIL: "Sorry this feature is not available at the moment, please try again later. ",
        MYCLAIMS_DEPENDENTINFO_NOTAVAIL: "Sorry, your dependent's information is not available at the moment, please try again later.",
        MYCLAIMS_DETAILS_NOTAVAIL: "Details are not available for this claim",
        MYCLAIMS_DETAILS_NOTAVAIL_PENDING: "Details are not available for a Pending claim",
        MYCLAIMS_DETAILS_NOTAVAIL_CLAIMNUMBER: "Details are not available for this claim number",

        MYDOCTOR_DEPENDENTSPOPOVER_INF_NOTAVAIL: "Sorry, your dependent's information is not available at the moment, please try again later.",

        MYDOCTOR_INCORRECT_PHNNO: 'Cannot add to contacts. Incorrect Phone number',
        MYDOCTOR_CANNOTCALL_INCRCT_PHNNO: "Cannot call incorrect phone number",
        MYDOCTOR_FEATURE_NOTAVAIL: "This feature is not available on your device.",
        MYDOCTOR_SERVER_ERROR: 'Server encountered error processing your request',
        MYDOCTOR_DONOTHAVE_DOCTORVISIT: 'You do not have any doctor visits yet. <span class="alertSpanLinkCls" #alertLinkId>Find a Doctor</span>',
        MYDOCTOR_DONOTHAVE_DOCTORVISIT_WITHOUTLINK: 'You do not have any doctor visits yet.Find a Doctor',

        MYMEDICATIONS_DEPENDENTSPOPOVER_INF_NOTAVAIL: "Sorry, your dependent's information is not available at the moment, please try again later.",

        MYMEDICATIONS_CANNOTCALL_INCRCT_PHNNO: "Cannot call incorrect phone number",
        MYMEDICATIONS_FEATURE_NOTAVAIL: "This feature is not available on this device.",
        MYMEDICATIONS_SERVER_ERROR: 'Server encountered error processing your request',
        MYMEDICATIONS_RX_SERVER_ERROR: "Error while getting recent Rx - Server encountered error processing your request",
        MYMEDICATIONS_INCORRECT_PHNNO: 'Cannot add to contacts. Incorrect Phone number',

        MYPLAN_FEATURE_NOTAVAIL: "Sorry this feature is not available at the moment, please try again later. ",
        MYPLAN_FEATURE_INACTIVE: "<b>We Couldn't find any plans.</b><br>Have a question about your coverage and benefits?<br>Please call <a href=\"tel:8887721722\">1-888-772-1722</a> for details. ",
        MYCARDS_FEATURE_INACTIVE: "<b>We Couldn't find any cards.</b><br>Have a question about your coverage and benefits?<br>Please call <a href=\"tel:8887721722\">1-888-772-1722</a> for details. ",
        MYSETTINGS_PREFERENCE_SERVER_ERROR: "Error while getting preferences - Server encountered error on processing your request",
        MYSETTINGS_MEMBERPREFERENCE_SERVER_ERROR: "Error while updating preferences - Server encountered error on processing your request",
        MYSETTINGS_PASSWORD_SERVER_ERROR: 'Server encountered error while updating password - ',
        MYSETTINGS_MEMBERPROFILE_SERVER_ERROR: "Error while updateMemberProfile - Server encountered error processing your request",
        MYSETTINGS_INVALID_EMAIL: 'Invalid email address. Please try again.',
        MYSETTINGS_INVALID_PHONENUM: 'Invalid phone number. Please try again.',
        MYSETTINGS_PROFILEINFO_SERVER_ERROR: "Error while getting profile info - Server encountered error processing your request",
        MYSETTINGS_ALERTS_SERVER_ERROR: "Error while getting alerts - Server encountered error processing your request",
        MYSETTINGS_UPDATEPREFERENCE_SERVER_ERROR: "You do not have a mobile number saved. Go to your Profile and add one.",
        MYSETTINGS_PREFERENCE_SYSTEM_ERROR: "System error. Please try again.",

        SSNAUTH_SECURITYQUES_YOUMUST_ANSWERQUESTIONS: "You must answer all of the questions.Please try again.",
        SSNAUTH_SECURITYQUES_LNAUTH_SERVER_ERROR: 'Server encountered error in Lexis Nexis auth',

        DASHBOARD_MYBLUEAPP_CURRENTLY_UNAVAIL: "The MyBlue Member App is currently unavailable. Please try again. We apologize for any inconvenience.",

        REGISTRATION_REGERROR_INVALID_SEC_TOKEN: 'Registration Error - Invalid Security Token',
        INTERNET_CONNECTION_ERROR: 'Check your internet connection and try again.',
        USER_MIGRATION_SENDCOMMUNICATIONCHANNEL_ERROR: 'Error while sendCommunicationChannel access code - Server encountered error processing your request',
        USER_MIGRATION_DESTINATION_URL: '"Error while post destination url.',
        REGISTRATION:{
            "-90300":"We're currently experiencing technical difficulties. Please try again later, or call member service at <a href='tel:8887721722'>1-888-772-1722</a> for  assistance.",
            "-90302":"Invalid Input",
            "-90303":"An account already exists with this userid. Log in or try again with a new userid"
        },
        MEMBERLOGIN: {
            //"-1": "There was an error during login. Please try again.",
            //"-4": "Incorrect username or password. Please try again.",
            //"-5": "You have a restricted account. Please call Member Service at <a href='tel:8887721722'>1-888-772-1722</a>, Monday through Friday, 8:00 a.m. - 6:00 p.m. ET.",
            //"-6": "Your account has been locked due to too many incorrect log in attempts. Please call Member Service at <a href='tel:8887721722'>1-888-772-1722</a>, Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.",
            //"-7": "Your account has been locked due to too many incorrect log in attempts. Please call Member Service at <a href='tel:8887721722'>1-888-772-1722</a>, Monday through Friday, 8:00 a.m. to 6:00 p.m. ET.",
            //"-8": "We're unable to display this screen at this timeYou have a restricted account. Please call Member Service at <a href='tel:8887721722'>1-888-772-1722</a>, Monday through Friday, 8:00 a.m. - 6:00 p.m. ET.",
            //"-9": "You have a restricted account. Please call Member Service at <a href='tel:8887721722'>1-888-772-1722</a>, Monday through Friday, 8:00 a.m. - 6:00 p.m. ET."
            "-90300": "We're currently experiencing technical difficulties. Please try again later, or call member service at <a href='tel:8887721722'>1-888-772-1722</a> for  assistance.",
            "-90301": "Incorrect username or password. Please try again.",
            "-90305": "You've exceeded the maximum number of attempts. You can try again in 30 minutes, or call <a href='tel:8887721722'>1-888-772-1722</a> for assistance.",
            "-90306": "You have exceeded the maximum number of attempts to verify your information. Please try again after 24 hours. In order to further assist you, you may also contact us at <a href='tel:8887721722'>1-888-772-1722</a>."
        },
        UPDATE_MEM_AUTHINFO:{
            "-1":"An account already exists for this member ID number. Please sign in or try again with a new number.",
            "-20980":"We're sorry, there's been a system error. Please try again.",
            "-20981":"We're sorry, there's been a system error. Please try again.",
            "-20982":"We're sorry, there's been a system error. Please try again.",
            "-20983":"We're sorry, there's been a system error. Please try again.",
            "-20984":"It appears that you already have an account. Please login.",
            "-20985":"It appears that you already have an account. Please login."
        },
        USERMIGRATION_MEMACCTMERGE: {
            "-90300": "We're currently experiencing technical difficulties. Please try again later, or call <a href='tel:8887721722'>1-888-772-1722</a> for immediate assistance.",
           // "-2": "We're currently experiencing technical difficulties. Please try again later, or call <a href='tel:8887721722'>1-888-772-1722</a> for immediate assistance.",
            "-90310": "Invalid Input"
        },
        USERMIGRATION_VERIFYCOMMCHLACCCODE: {
            "-1": "Your verification code has expired. Please request a new code.",
            "-90300": "We're currently experiencing technical difficulties. Please try again later, or call <a href='tel:8887721722'>1-888-772-1722</a> for immediate assistance.",
            "-90327": "The access code you entered does not match our records. Please try again.",
            "-90326": "Invalid Input"
        },
        USERMIGRATION_VERIFYACCESSCODE: {
            "-1": "Your verification code has expired. Please request a new code.",
            "-90300": "We're currently experiencing technical difficulties. Please try again later, or call <a href='tel:8887721722'>1-888-772-1722</a> for immediate assistance.",
            "-90322": "The access code you entered does not match our records. Please try again.",
            "-90321": "Invalid Input"
        },
        USERMIGRATION_SENDACCESSCODE: {
            "-90300": "We are unable to complete your request. Please try again.",
            "-90320": "Invalid Input"
        },
        USERMIGRATION_SENDCOMMCHLACCCODE: {
            "-90300": "We're currently experiencing technical difficulties. Please try again later, or call <a href='tel:8887721722'>1-888-772-1722</a> for immediate assistance.",
            "-90325": "Invalid Input"
        },
        USERMIGRATION_MEMLOOKUP: {
            "-90300": "We're currently experiencing technical difficulties. Please try again later, or call <a href='tel:8887721722'>1-888-772-1722</a> for immediate assistance."
        },
        FORGOTUSERNAME_VERIFYFUNUSER: {
            "-90378": "We were unable to identify your account with the information provided.", 
            "verifyUnuserErrorPart":", or call Member Service at <a href='tel:8887721722'>1-888-772-1722</a>, Monday through Friday, 8:00 a.m. to 6:00 p.m. ET."
        },
        FORGOTUSERNAME_VERIFYFUNAUTHUSER: {
            "-90392": "Date of birth is incorrect"
        },
        FORGOTUSERNAME_VERIFYFUNACCESSCODE: {
            "-3": "The access code you entered does not match our records. Please try again."
        },
        infoMismatchMsg:"The information you entered doesn't match our records.Please try again, or call Member Service at <a href='tel:8887721722'>1&#8209;888&#8209;772&#8209;1722</a>, Monday through Friday, 8:00 a.m. to 6:00 p.m. ET."
    }
    static ALERT_TYPE: any = {
        NOTIFICATION: "notification",
        SUCCESS: "success",
        ERROR: "error"
    }
    static MIGRATION_TYPE: any = {
        MUTIPLEAPP: "MULTIPLE-APP",
        SINGLEAPP: "SINGLE-APP",
        SINGLEWEB: "SINGLE-WEB",
        SINGLEWEBAPP: "SINGLE-WEB-SINGLE-APP",
        MULTIAPPSINGLEWEB: "SINGLE-WEB-MULTIPLE-APP"
    }

    static SECURITY_QUESTIONS_OPTIONS = [
        { label: 'Who was your favorite teacher?', value: 'value 1' },
        { label: 'Where did you meet your spouse?', value: 'value 2' },
        { label: 'What is your Mother’s middle name?', value: 'value 3' },
        { label: 'Who was your childhood best friend?', value: 'value 4' },
        { label: 'Where does your nearest relative live?', value: 'value 5' },
        { label: 'What was the name of your first school?', value: 'value 6' },
        { label: 'What was the name of your first pet?', value: 'value 7' }
    ];

    static PHONE_NUMBER_TYPES = [
        { label: 'Mobile', value: 'Mobile' },
        { label: 'Home', value: 'Home' },
        { label: 'Work', value: 'Work' }
    ];
    static SATES = [
        { "label": "AL", "value": "AL" },
        { "label": "AK", "value": "AK" },
        { "label": "AZ", "value": "AZ" },
        { "label": "AR", "value": "AR" },
        { "label": "CA", "value": "CA" },
        { "label": "CO", "value": "CO" },
        { "label": "CT", "value": "CT" },
        { "label": "DE", "value": "DE" },
        { "label": "FL", "value": "FL" },
        { "label": "GA", "value": "GA" },
        { "label": "HI", "value": "HI" },
        { "label": "ID", "value": "ID" },
        { "label": "IL", "value": "IL" },
        { "label": "IN", "value": "IN" },
        { "label": "IA", "value": "IA" },
        { "label": "KS", "value": "KS" },
        { "label": "KY", "value": "KY" },
        { "label": "LA", "value": "LA" },
        { "label": "ME", "value": "ME" },
        { "label": "MD", "value": "MD" },
        { "label": "MA", "value": "MA" },
        { "label": "MI", "value": "MI" },
        { "label": "MN", "value": "MN" },
        { "label": "MS", "value": "MS" },
        { "label": "MO", "value": "MO" },
        { "label": "MT", "value": "MT" },
        { "label": "NE", "value": "NE" },
        { "label": "NV", "value": "NV" },
        { "label": "NH", "value": "NH" },
        { "label": "NJ", "value": "NJ" },
        { "label": "NM", "value": "NM" },
        { "label": "NY", "value": "NY" },
        { "label": "NC", "value": "NC" },
        { "label": "ND", "value": "ND" },
        { "label": "OH", "value": "OH" },
        { "label": "OK", "value": "OK" },
        { "label": "OR", "value": "OR" },
        { "label": "PA", "value": "PA" },
        { "label": "RI", "value": "RI" },
        { "label": "SC", "value": "SC" },
        { "label": "SD", "value": "SD" },
        { "label": "TN", "value": "TN" },
        { "label": "TX", "value": "TX" },
        { "label": "UT", "value": "UT" },
        { "label": "VT", "value": "VT" },
        { "label": "VA", "value": "VA" },
        { "label": "WA", "value": "WA" },
        { "label": "WV", "value": "WV" },
        { "label": "WY", "value": "WY" }];
    constructor() {

    }
}