
export class AuthService {

    private users:any[]  = []
    constructor(){}

    login = (data:any):string=> {
       console.log(users)
        return "DONE"

    }
    signup = (data:any):string=> {
        return "DONE Signup"

    }

}

export default new AuthService()
