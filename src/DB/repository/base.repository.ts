import { CreateOptions, HydratedDocument, Model } from "mongoose";
import { IUser } from "../../common/interfaces";


export abstract  class BaseRepository<TRawDocument> {

    constructor(protected readonly  model : Model<TRawDocument>){

    }
    create( {data , options} :{data: Partial<IUser>[] , options?:CreateOptions} ):Promise<HydratedDocument<TRawDocument> [] > {
        return this.model.create(data as any  , options)
    }

}