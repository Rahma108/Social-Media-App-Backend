
import { EmailEnum, ProviderEnum } from "../../common/enums";
import { BadRequestException, ConflictException, NotFoundException } from "../../common/exception";
import { IUser } from "../../common/interfaces";
import { emailEmitter, emailTemplate, sendEmail } from "../../common/utils/email";
import { createNumberOtp } from "../../common/utils/otp";
import { compareHash, encrypt, generateHash } from "../../common/utils/security";
import { UserRepository } from "../../DB/repository/user.repository";
import { ConfirmEmailDTO, LoginDTO, SignupDTO } from "./auth.dto"
import { ILoginResponse} from "./auth.interface";
import { redisService } from "../../common/service";
export class AuthService {
    // To reach any Repository ..
    private readonly userRepository : UserRepository
    private readonly redisService  = redisService
    constructor(){
        this.userRepository= new UserRepository()
    }
    
    private verifyEmailOtp = async({ title   , subject=EmailEnum.confirmEmail ,  email }
        :{title:string , subject:EmailEnum , email:string } )=>{
           //Check Block Conditional .
        const blockKey=  this.redisService.otpBlockKey({email , type:subject })
        const remainingBlockTime = await this.redisService.ttl(blockKey)
        if(remainingBlockTime>0){
            throw  new ConflictException(`You have reached Max Request Trial Count please try again later after ${remainingBlockTime} sec. `)
        }

        const oldCodeTTL = await this.redisService.ttl(this.redisService.otpKey({email , type:subject}))
        if(oldCodeTTL > 0 ){
            throw  new ConflictException(`Sorry we can not send new otp until first one get expired please try again after ${oldCodeTTL} `)

        }
        //check Max Request Trials 
        const maxTrialKey = this.redisService.otpMaxRequestKey({email , type:subject })
            const checkOtpMaxRequest = Number(await this.redisService.get(maxTrialKey) || 0 )
            if(checkOtpMaxRequest>=3){
                await this.redisService.set({
                key:  blockKey , 
                value : 0
                , ttl:300 })
        
            throw  new ConflictException("You have reached Max Request Trial Count please try again later after 300 sec. ")

            }

            const code = await createNumberOtp()
            await this.redisService.set({
            key: this.redisService.otpKey({email , type:subject }) , 
            value : await generateHash({plaintext : code.toString()})
            , ttl: 120
        })
            await sendEmail({
                to:email ,
                subject,
                html:emailTemplate({code , title })
            })
        checkOtpMaxRequest  > 0 ? await this.redisService.increment(maxTrialKey): await this.redisService.set({key : maxTrialKey , value : 1 , ttl : 300 })
        return ;
}

//Confirm Email with otp..
    public  confirmEmail = async({otp , email} : ConfirmEmailDTO ) : Promise<void>=>{

        const account = await this.userRepository.findOne({
        filter:{email , confirmEmail: { $eq: null } , Provider:ProviderEnum.SYSTEM }  ,
        projection:"email"
    })
    if(!account){
        throw  new NotFoundException("Fail to find Match account ❌")
    }
    const hashOtp = await this.redisService.get(this.redisService.otpKey({email}))
    if(!hashOtp){
        throw new NotFoundException("Expired OTP 😊")
    }
    if(!await compareHash({plaintext: otp  , cipherText: hashOtp} )){
        throw  new ConflictException("Invalid OTP ❌")
    }
    account.confirmEmail = new Date()
    await account.save()
    await this.redisService.deleteKeys(await this.redisService.keys(this.redisService.otpKey({email })))
    return ;
    }

    public reSendConfirmEmail = async({email}:{email : string})=>{
        const account = await this.userRepository.findOne({
        filter:{email , confirmEmail: { $eq: null } , Provider:ProviderEnum.SYSTEM }  ,
        projection:"email"
    })
    if(!account){
        throw new  NotFoundException("Fail to find Match account ❌")
    }
        // Re-Send a verification code to email after registration
    await this.verifyEmailOtp({title  : "Verify Account", subject: EmailEnum.confirmEmail , email:email })
    return ;


}
    public login(data:LoginDTO):ILoginResponse {
        const {email , password } = data
        return  { email , password }

    }
    public async  signup (data:SignupDTO):Promise<IUser> {
        let {username , email , password , phone} = data
        const checkUserExist = await this.userRepository.findOne({filter:{email } , projection:"email" , options:{lean:true}}) 
        if(checkUserExist){
                throw new ConflictException("Email Exists ‼️‼️")
        }
        const user =  await this.userRepository.create({data: {username , email , password: await generateHash({plaintext:password})  , phone:await encrypt(phone)} })
        // const user = await this.userRepository.createOne({data: {username , email , password } })
        if(!user){
            throw new BadRequestException("Fail To Create User ✖️")
        }
        
        emailEmitter.emit("sendEmail" ,async ()=>{
        await this.verifyEmailOtp({title  : "Verify Account", subject: EmailEnum.confirmEmail , email:email })
    })
        return user.toJSON()
    }
}


export default new AuthService()

