export interface GeneralErrorInterface {
    result: number; // example: -90200  negative number of max 5 non-repeating digits within range, -90200 to -90299
    errormessage: string; // example: System Error. Please try again.
    displaymessage: string; // example: System Error. Please try again.
}

export interface MyBlueGeneralAPIRequestModelInterface {
    useridin: string; // *UserIdstring pattern: ^[\w-]+@([\w-]+\.)+[\w-]+$|^\d{10}$
    // example: foo@gmail.com  email id or phone number or alpha-numeric id    
}
