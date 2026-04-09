
import { HydratedDocument } from 'mongoose';
import { IUser } from '../../common/interfaces';
import { decrypt } from '../../common/utils/security';
import { ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } from '../../config/config';
import { ConflictException } from '../../common/exception';
import { TokenService } from '../../common/service/token.service';
import { redisService } from '../../common/service';
import { LogoutEnum } from '../../common/enums/security.enum';

export class UserService {
    private readonly tokenService : TokenService
    
        constructor(){
            this.tokenService = new TokenService()
        }
        async profile( user: IUser | HydratedDocument<IUser>){
            if (user) {
            user.phone =await decrypt(user.phone)
}
            return user;
}
    async createRevokeToken( { userId ,jti , ttl  }: { userId:string ,jti:string , ttl:number  }){
    await redisService.set({
                key: redisService.revokeTokenKey({userId , jti}),
                value : jti ,
                ttl 
            })
    return ;
}
    async  rotateToken (user:HydratedDocument<IUser> , {iat , jti ,  sub }:{iat:number , jti:string , sub:string }, issuer: string ){
    const expiresAt = (iat + ACCESS_EXPIRES_IN) * 1000;

    if (expiresAt > Date.now() + 30000) {
        throw new ConflictException("Current access token still valid");
    }
    await this.createRevokeToken({userId:sub , jti , ttl: iat  + REFRESH_EXPIRES_IN })
    return await this.tokenService.createLoginCredentials(user , issuer )
    }

    async logout (flag : LogoutEnum, user : HydratedDocument<IUser> , {jti , iat , sub}: { jti:string  ,iat:number , sub:string } ){
    let status = 200
    switch (flag) {
        case LogoutEnum.All:
            user.changeCredentialTime= new Date(Date.now()) 
            await user.save()

            await redisService.deleteKeys(await redisService.keys(redisService.baseRevokeTokenKey(sub)))
            break;
    
        default:
            await this.createRevokeToken({userId:sub , jti , ttl:iat  + REFRESH_EXPIRES_IN })
            status=201
            break;
        }
    return status

}
    }
export default new UserService()