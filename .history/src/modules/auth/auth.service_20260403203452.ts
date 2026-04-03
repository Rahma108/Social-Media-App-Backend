import { ApplicationException } from "../../common/exception"

export class AuthService {

    // private users:any[]  = []
    constructor(){}

    login = (data:any):string=> {
       console.log({this : this})
        return "DONE"

    }
    signup = (data:any):string=> {
        throw new ApplicationException("Method Not implement" , {cause:{statusCode: 400 , extra:"LoL" } })

        return "DONE Signup"

    }

}

export default new AuthService()
