import { LoginDTO, SignupDTO } from "./auth.dto"

export class AuthService {

    // private users:any[]  = []
    constructor(){}

    login = (data:LoginDTO):string=> {
        return "DONE"

    }
    signup = (data:SignupDTO):S=> {
        console.log(data)
        const {username , email , password } = data
        console.log({username , email , password });
        return "DONE Signup"

    }

}

export default new AuthService()
