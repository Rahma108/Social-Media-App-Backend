
export interface ISignupResponse  extends ILoginResponse{
    username : string
    email:string ,
    password : string


}
export interface ILoginResponse {
  
    email:string ,
    password : string


}