import { LoginDTO, SignupDTO } from "./auth.dto"
import { ILoginResponse, ISignupResponse } from "./auth.interface";

export class AuthService {

    // private users:any[]  = []
    constructor(){}

    login = (data:LoginDTO):ILoginResponse=> {

        const {email , password } = data
        console.log({  email , password });
        return  { email , password }

    }
    signup = (data:SignupDTO):ISignupResponse=> {

        const {username , email , password } = data
        console.log({username , email , password });
        return  {username , email , password }

    }

}

export default new AuthService()
