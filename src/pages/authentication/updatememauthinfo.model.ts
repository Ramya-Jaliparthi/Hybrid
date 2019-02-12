export class UpdateMemAuthinfoResponse{

    appAccounts: [UpdateMemAuthinfoDetails];
    webAccount: UpdateMemAuthinfoDetails;
}

export class UpdateMemAuthinfoDetails{
    Userid:string;
    firstName:string;
    lastName:string;
    DOB:string;
    mobile:string;
    email:string;
    phonetype:string;
    HintQuestion:string;
    HintAnswer:string;
    }