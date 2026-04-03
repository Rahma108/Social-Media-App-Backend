import { LoginDTO, SignupDTO } from "./auth.dto"
import { ILoginResponse, ISignupResponse } from "./auth.interface";

export class AuthService {
    constructor(){}
    login = (data:LoginDTO):ILoginResponse=> {
        const {email , password } = data
        return  { email , password }

    }
    signup = (data:SignupDTO):ISignupResponse=> {
        const {username , email , password } = data
        return  {username , email , password }

    }

}

export default new AuthService()
