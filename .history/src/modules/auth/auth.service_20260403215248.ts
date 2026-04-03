import { LoginDTO, SignupDTO } from "./auth.dto"

export class AuthService {

    // private users:any[]  = []
    constructor(){}

    login = (data:LoginDTO):LoginDTO=> {
        return "DONE"

    }
    signup = (data:SignupDTO):SignupDTO=> {
        console.log(data)
        const {username , email , password } = data
        console.log({username , email , password });
        return  {username , email , password }

    }

}

export default new AuthService()
