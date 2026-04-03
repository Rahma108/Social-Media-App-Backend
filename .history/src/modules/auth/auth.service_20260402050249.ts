
export class AuthService {

    // private users:any[]  = []
    constructor(){}

    login = (data:any):string=> {
       console.log({this : this})
        return "DONE"

    }
    signup = (data:any):string=> {
        return "DONE Signup"

    }

}

export default new AuthService()
