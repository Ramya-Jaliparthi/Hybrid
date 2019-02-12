export class MemberLookupResponse{

    appAccounts: [MemberLookupDetails];
    webAccount: MemberLookupDetails;
    displaymessage:string;
    result:string;
}

export class MemberLookupDetails{
    userID:string;
    isVerifiedEmail:string;
    scope:string;
    email:string;
}