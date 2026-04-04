import { UserModel } from "../../DB/models";
import { LoginDTO, SignupDTO } from "./auth.dto"
import { ILoginResponse, ISignupResponse } from "./auth.interface";

export class AuthService {
    constructor(){}
    login = (data:LoginDTO):ILoginResponse=> {
        const {email , password } = data
        return  { email , password }

    }
    signup =  async (data:SignupDTO):Promise<string>=> {
        const {username , email , password } = data
        const user = await UserModel.create({username , email , password })
        return  "DONE"
    }
}

export default new AuthService()
