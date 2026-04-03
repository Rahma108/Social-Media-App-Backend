import { ApplicationException } from "../../common/exception"

export class AuthService {

    // private users:any[]  = []
    constructor(){}

    login = (data:any):string=> {
        return "DONE"

    }
    signup = (data:any):string=> {
        console.log(data)
        const 
        throw new ApplicationException("Method Not implement"  , 400 , {extra:"LolOl"}  )

        return "DONE Signup"

    }

}

export default new AuthService()
