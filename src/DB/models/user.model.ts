
import { model, models  , Schema }  from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enums";
import { IUser } from "../../common/interfaces";
const userSchema = new Schema<IUser>({

    firstName : {type : String , required: true } ,
    lastName : {type : String , required: true } ,
    email: {type : String , required: true  , unique: true } ,
    password: {type : String , required: function(this){
        return this.provider  == ProviderEnum.SYSTEM
    } },
    bio: {type : String , required: false , maxLength: 200 },
    DOB: {type : Date , required: false } ,
    confirmedAt :{type : Date , required: false },
        gender : { 
        type: Number,   
        enum: Object.values(GenderEnum).filter(v => typeof v === "number"),
        default: GenderEnum.MALE
        },

        role : { 
        type: Number,  
        enum: Object.values(RoleEnum).filter(v => typeof v === "number"),
        default: RoleEnum.USER
        },
    phone :  {type : String , required: true} ,
    profileImage: {type : String , required: false },
    coverImages: {type : [String] , required: false },
    changeCredentialTime:{type:Date } ,
    confirmEmail : {type:Date } ,
    provider: {type :  Number , enum :Object.values(ProviderEnum).filter(v => typeof v === "number") ,  
        default: ProviderEnum.SYSTEM}


} , {
    timestamps:true ,
    collection:"users" ,
    strict:true ,
    strictQuery:true , 
    toJSON:{virtuals:true} ,
    toObject:{virtuals:true}

} )


userSchema.virtual('username').get(function(this:IUser){
    return `${this.firstName} ${this.lastName}`

}).set(function(this:IUser , value: string ){
        const [firstName , lastName] =value.split(" ")
        this.firstName = firstName  as string
        this.lastName = lastName  as string

})

export const UserModel = models['User'] || model<IUser>("User", userSchema);