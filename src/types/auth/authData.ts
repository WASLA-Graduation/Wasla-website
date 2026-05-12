export interface loginData{
    email: string;
    password: string;
}
export interface roleData{
    id : string | undefined;
    roleName: string;
    value: string;
}
export interface signData{
    email: string;
    password: string;
    confirmPassword: string;
    roleId: string;
}
export interface verifyEmailData{
    email: string;
    verificationCode: string;
    type: number
}
export interface resendData{
    email: string;
    verificationType: number
}
export interface forgetData{
    email: string;
    newPassword: string;
    otp:string
}
export interface changePassData{
    email:string;
    currentPassword : string;
    newPassword : string;
}