
import { BadRequestException } from "../../common/exception";
import { UserModel } from "../../DB/models";
import { UserRepository } from "../../DB/repository/user.repository";
import { LoginDTO, SignupDTO } from "./auth.dto"
import { ILoginResponse} from "./auth.interface";
import { IUser } from "../../common/interfaces";

export class AuthService {
    private readonly userRepository : UserRepository
    constructor(){
        this.userRepository= new UserRepository(UserModel)

    }
    login = (data:LoginDTO):ILoginResponse=> {
        const {email , password } = data
        return  { email , password }

    }
    signup =  async (data:SignupDTO):Promise<IUser> => {
        let {username , email , password } = data
        const [user] =  await this.userRepository.create({
                data:[ {username , email , password } ],
            

        })
        if(!user){
            throw new BadRequestException("Fail To Create User ✖️")
        }
        return user.toJSON() 
    }
}

export default new AuthService()
