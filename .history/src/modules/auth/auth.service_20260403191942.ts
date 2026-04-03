
export class AuthService {

    // private users:any[]  = []
    constructor(){}

    login = (data:any):string=> {
       console.log({this : this})
        return "DONE"

    }
    signup = (data:any):string=> {
        throw new Error("Method Not implement" , {cause:{statusCode: 400 , extra: } })

        return "DONE Signup"

    }

}

export default new AuthService()
