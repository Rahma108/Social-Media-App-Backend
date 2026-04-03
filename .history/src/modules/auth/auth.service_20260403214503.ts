
export class AuthService {

    // private users:any[]  = []
    constructor(){}

    login = (data:any):string=> {
        return "DONE"

    }
    signup = (data:Si):string=> {
        console.log(data)
        const {username , email , password } = data
        console.log({username , email , password });
        return "DONE Signup"

    }

}

export default new AuthService()
