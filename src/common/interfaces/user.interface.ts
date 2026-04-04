import { GenderEnum, RoleEnum } from "../enums";


export interface IUser {
    username : string ,
    firstName : string ,
    lastName : string ,
    email: string ,
    password: string ,
    bio?: string ,
    DOB?: Date ,
    confirmedAt? : Date ,
    gender? : GenderEnum,
    role ?: RoleEnum ,
    phone? : string ,
    profileImage?: string ,
    coverImages?: string[],
    createdAt?: Date;
    updatedAt?: Date;

}