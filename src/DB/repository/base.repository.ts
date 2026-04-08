
import {MongooseUpdateQueryOptions ,UpdateQuery, AnyKeys, CreateOptions, FlattenMaps, HydratedDocument, Model, PopulateOptions, ProjectionType, QueryFilter, QueryOptions, Types, UpdateWithAggregationPipeline, UpdateResult, UpdateWriteOpResult, DeleteResult } from "mongoose";

export abstract  class BaseRepository<TRawDocument> {

    constructor(protected readonly  model : Model<TRawDocument>){

    }
    // Overloading ...............
    create( {data } :{data: AnyKeys<TRawDocument>} )  //  Prototype CreateOne
    :Promise<HydratedDocument<TRawDocument>>    

    create( {data , options} :{data: AnyKeys<TRawDocument>[] , options?:CreateOptions} )  // Prototype Create
    :Promise<HydratedDocument<TRawDocument> [] > 

    create( {data , options} :{data: AnyKeys<TRawDocument>[] | AnyKeys<TRawDocument> , options?:CreateOptions} )
    :Promise<HydratedDocument<TRawDocument> [] | HydratedDocument<TRawDocument> > {
        return this.model.create(data as any  , options)
    }
    
    async createOne({
        data,
        options = {} 
        }: {
        data: Partial<TRawDocument>,
        options?: CreateOptions | undefined
        }): Promise<HydratedDocument<TRawDocument>> {

        const [doc ] = await  this.create({data: [ data] , options : options }) || []
        return doc  as HydratedDocument<TRawDocument>
        }
    
    async findOne({
        filter,
        projection,
        options,
        }: {
        filter: QueryFilter<TRawDocument>;
        projection?: ProjectionType<TRawDocument> | null | undefined;
        options?: QueryOptions<TRawDocument> & {lean : false}
        }) : Promise<HydratedDocument<TRawDocument> | null>
    async findOne({
        filter,
        projection,
        options,
        }: {
        filter: QueryFilter<TRawDocument>;
        projection?: ProjectionType<TRawDocument> | null | undefined;
        options?: QueryOptions<TRawDocument>  & {lean : true }
        }) : Promise< FlattenMaps<TRawDocument> | null>

        async findOne({
        filter={},
        projection,
        options,
        }: {
        filter: QueryFilter<TRawDocument>;
        projection?: ProjectionType<TRawDocument> | null | undefined;
        options?: QueryOptions<TRawDocument>
        }) : Promise< FlattenMaps<TRawDocument> | HydratedDocument<TRawDocument> | null>{
        const doc =  this.model.findOne(filter , projection  , options);
        if(options?.lean){
            doc.lean()
        }
        if(options?.populate) doc.populate(options.populate as PopulateOptions[])
        return await doc.exec()
    }
    async findById({
        _id,
        projection,
        options,
        }: {
        _id: Types.ObjectId;
        projection?: ProjectionType<TRawDocument> | null | undefined;
        options?: QueryOptions<TRawDocument> & {lean : false}
        }) : Promise<HydratedDocument<TRawDocument> | null>
    async findById({
        _id,
        projection,
        options,
        }: {
        _id: Types.ObjectId;
        projection?: ProjectionType<TRawDocument> | null | undefined;
        options?: QueryOptions<TRawDocument>  & {lean : true }
        }) : Promise< FlattenMaps<TRawDocument> | null>


    async findById({
        _id,
        projection,
        options,
        }: {
        _id: Types.ObjectId;
        projection?: ProjectionType<TRawDocument> | null | undefined;
        options?: QueryOptions<TRawDocument>
        }) : Promise< FlattenMaps<TRawDocument> | HydratedDocument<TRawDocument> | null>{
        const doc =  this.model.findById( _id , projection);
        if(options?.lean){
            doc.lean()
        }
        if(options?.populate) doc.populate(options.populate as PopulateOptions[])
        return await doc.exec()
}
    async find({ model, select, filter, options }: any) {
        let doc = model.find(filter || {}).select(select || "");

        if (options?.populate) {
        doc = doc.populate(options.populate);
        }

        if (options?.skip) {
        doc = doc.skip(options.skip);
        }

        if (options?.limit) {
        doc = doc.limit(options.limit);
        }

        if (options?.lean) {
        doc = doc.lean();
        }

        return doc.exec();
    }

    async paginate({
        filter = {},
        options = {},
        select,
        page = "all",
        size = 5,
        model,
    }: any) {
        let docsCount;
        let pages;

        if (page !== "all") {
        const currentPage = Math.max(1, Number(page));
        const limit = Math.max(1, Number(size) || 5);

        options.limit = limit;
        options.skip = (currentPage - 1) * limit;

        docsCount = await model.countDocuments(filter);
        pages = Math.ceil(docsCount / limit);

        page = currentPage;
        }

        const result = await this.find({ model, select, filter, options });

        return {
        docsCount,
        limit: options.limit,
        pages,
        currentPage: page !== "all" ? page : undefined,
        result,
        };
    }
    insertMany = async ({
        data,
        model,
        }: {
        data: any[];
        model: Model<any>;
        }) => {
        return await model.insertMany(data);
        };

    async updateOne({
        filter = {},
        update,
        options
    } :{
        filter: QueryFilter<TRawDocument>,
        update: UpdateQuery<TRawDocument> | UpdateWithAggregationPipeline,
        options?: MongooseUpdateQueryOptions<TRawDocument>
    } 
    ):Promise<UpdateWriteOpResult>{
        return await this.model.updateOne(filter , update , options )
    }

    async updateMany({
        filter = {},
        update,
        options
    } :{
        filter: QueryFilter<TRawDocument>,
        update: UpdateQuery<TRawDocument> | UpdateWithAggregationPipeline,
        options?: MongooseUpdateQueryOptions<TRawDocument>
    } 
    ):Promise<UpdateWriteOpResult>{
        return await this.model.updateMany(filter , update , options )
    }

    async deleteOne({
        filter ={},
    } :{
        filter: QueryFilter<TRawDocument>,
    } 
    ):Promise<DeleteResult>{
        return await this.model.deleteOne(filter)
    }

    async deleteMany({
        filter={} ,
    } :{
        filter: QueryFilter<TRawDocument>,
    } 
    ):Promise<DeleteResult>{
        return await this.model.deleteMany(filter)
    }

    async findOneAndUpdate({
        filter = {},
        update,
        options
    } :{
        filter: QueryFilter<TRawDocument>,
        update: UpdateQuery<TRawDocument> | UpdateWithAggregationPipeline,
        options?: MongooseUpdateQueryOptions<TRawDocument>
    } 
    ):Promise<HydratedDocument<TRawDocument> | null >{
        return await this.model.findOneAndUpdate(filter , update , options )
    }

    async findByAndUpdate({
        _id,
        update,
        options
    } :{
        _id : Types.ObjectId ,
        update: UpdateQuery<TRawDocument> | UpdateWithAggregationPipeline,
        options?: MongooseUpdateQueryOptions<TRawDocument>
    } 
    ):Promise<HydratedDocument<TRawDocument> | null >{
        return await this.model.findByIdAndUpdate(_id , update , options )
    }

    async findOneAndDelete({
        filter = {},
        options
    } :{
        filter: QueryFilter<TRawDocument>,
        options?: QueryOptions<TRawDocument>
    } 
    ):Promise<HydratedDocument<TRawDocument> | null >{
        return await this.model.findOneAndDelete(filter , options )
    }
    async findByIdAndDelete({
    _id ,
        options
    } :{
        _id : Types.ObjectId ,
        options?: QueryOptions<TRawDocument>
    } 
    ):Promise<HydratedDocument<TRawDocument> | null >{
        return await this.model.findByIdAndDelete(_id , options )
    }

}
