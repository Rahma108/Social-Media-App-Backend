
import { HydratedDocument, model, models  , Schema }  from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enums";
import { IUser } from "../../common/interfaces";
// import { encrypt, generateHash } from "../../common/utils/security";
// import { sendEmail } from "../../common/utils/email";
const userSchema = new Schema<IUser>({

    firstName : {type : String , required: true } ,
    lastName : {type : String , required: true } ,
    email: {type : String , required: true  , unique: true } ,
    password: {type : String , required: function(this){
        return this.provider  == ProviderEnum.SYSTEM
    } },
    bio: {type : String , required: false , maxLength: 200 },
    slug:{type : String , required: true }  ,
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
        default: ProviderEnum.SYSTEM} ,
    extra : {
        name : String
    } ,
    deletedAt: {type:Date } ,
    restoredAt: {type:Date }

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
        this.slug = value.replaceAll(/\s+/g , "-") 

})

// userSchema.pre("validate" , function(){ 
//         console.log("Pre Validate"  ) 
//         if( this.password && this.provider == ProviderEnum.GOOGLE ){
//             throw new BadRequestException("Google Account Cannot hold password ❌")

//         }

// })
// userSchema.pre("save" , async function(this : HydratedDocument<IUser> & {wasNew : boolean}  ){
        
//         this.wasNew = this.isNew 
//         console.log("Pre One" , this ) ; 
//         // console.log(this.isDirectModified("name"))  // false 
//         // console.log(this.isDirectModified("extra.name")) // false 
//         // console.log(this.isDirectModified("extra")) // true 
//         // console.log(this.directModifiedPaths()) ;
//         console.log(this.isNew)  // false 
//         console.log(this.isSelected("extra")) ; // true 

//         if(this.isModified("password")){
//             this.password = await generateHash({plaintext : this.password}) ;
//         }
//         if(this.phone && this.isModified("phone")){
//             this.phone = await encrypt(this.phone);
//         }
// })
// userSchema.post("save" , async function(){
//     console.log("Post One" , this)
//         const that = this as HydratedDocument<IUser> & {wasNew : boolean} 
//         console.log({post : that.wasNew})
//         if(that.wasNew){
//             await sendEmail({to : this.email  , subject:"confirmEmail" , html:"hello"})
//         }
// })
// userSchema.post("save" , async function(doc , next){
//         console.log("Post One" ) 
//         // next()
// })

// userSchema.post("validate" , function(){ // First Run .
//         console.log("Post Validate"  ) 
//         if(!this.slug || this.slug.includes(" ")){
//             throw new BadRequestException("Invalid Slug Format ❌")
//         }

// })
// updateOne , deleteOne == consider Query ----> document: true to be document
// userSchema.pre("updateOne" , { document: true } , async function(){
//     console.log(this)


// })

// userSchema.pre("insertMany", async function(doc){
//     console.log(this , doc)
// })

// userSchema.post("insertMany", async function(doc , next){
//     console.log(this , doc)
// })

userSchema.pre(["findOne" , "find"], async function(){
    // console.log(this );
    // console.log(this.getFilter())
    // console.log(this.getQuery())
    const query = this.getQuery()
    if(query['paranoid']  === false ){
        this.setQuery({...query})
    }else{
        this.setQuery({...query , deletedAt:{$exists:false }})
    }
    
})



userSchema.pre( ["updateOne" , "findOneAndUpdate"], async function(){
    const update = this.getUpdate() as HydratedDocument<IUser>
    if(update.deletedAt){
        this.setUpdate({...update , $unset:{restoredAt :  1 }})
    }
    if(update.restoredAt){
        this.setUpdate({...update , $unset:{deletedAt:  1 }})
        this.setUpdate({...this.getQuery() ,deletedAt:{$exists: true  } })
    }
    console.log(update)
    const query = this.getQuery()
    if(query['paranoid']  === false ){
        this.setQuery({...query})
    }else{
        this.setQuery({  deletedAt:{$exists:false } , ...query })
    }
    
})

userSchema.pre( ["deleteOne" , "findOneAndDelete"], async function(){
    
    const query = this.getQuery()
    if(query['force']  === true  ){
        this.setQuery({...query})
    }else{
        this.setQuery({  deletedAt:{$exists: true } , ...query })
    }
    
})
export const UserModel = models['User'] || model<IUser>("User", userSchema);