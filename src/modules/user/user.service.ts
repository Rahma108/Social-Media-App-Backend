import { HydratedDocument } from 'mongoose';
import { IUser } from '../../common/interfaces';
import { decrypt } from '../../common/utils/security';


export class UserService {
        constructor(){
        }
        async profile( user: IUser | HydratedDocument<IUser>){
            if (user) {
            user.phone =await decrypt(user.phone)
}
            return user;
}
}
export default new UserService()