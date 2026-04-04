
import { CreateOptions, HydratedDocument, Model, PopulateOptions } from "mongoose";
import { IUser } from "../../common/interfaces";


export abstract  class BaseRepository<TRawDocument> {

    constructor(protected readonly  model : Model<TRawDocument>){

    }
    create( {data , options} :{data: Partial<IUser>[] , options?:CreateOptions} ):Promise<HydratedDocument<TRawDocument> [] > {
        return this.model.create(data as any  , options)
    }
    
    createOne({
        data,
        options
        }: {
        data: Partial<IUser>,
        options?: CreateOptions
        }): Promise<HydratedDocument<TRawDocument>> {

        return this.model.create(data as any, options) as Promise<HydratedDocument<TRawDocument>>;
        }
    findById({
    id,
    select,
    options,
    }: {
    id: string;
    select?: string;
    options?: {
        populate?: PopulateOptions | PopulateOptions[];
        lean?: boolean;
    };
    }): Promise<any> {
    let query = this.model.findById(id).select(select || "");

    if (options?.populate) {
        query = query.populate(options.populate);
    }

    if (options?.lean) {
        return query.lean().exec();
    }

    return query.exec();
    }
    
    findOne ({
    model , 
    select,
    filter,
    options,
} :{
    model : Model<any>, 
    select?: string;
    filter: any;
    options?: {
        populate?: PopulateOptions | PopulateOptions[];
        lean?: boolean;
    };

}) {
    let doc = model.findOne(filter).select(select || "");
    if (options?.populate) {
        doc = doc.populate(options.populate);
    }

    if (options?.lean) {
        doc = doc.lean();
    }

    return doc.exec();
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

    updateOne = async ({
        model,
        filter,
        update,
        options,
        }: {
        model: Model<any>;
        filter?: any;
        update: any;
        options?: any;
        }) => {
        const newUpdate = { ...update };

        if (newUpdate.$inc) {
            newUpdate.$inc = { ...newUpdate.$inc, __v: 1 };
        } else {
            newUpdate.$inc = { __v: 1 };
        }

        return await model.updateOne(filter || {}, newUpdate, {
            ...options,
            runValidators: true,
        });
    };

    findOneAndUpdate = async ({
        model,
        filter,
        update,
        options,
        }: {
        model: Model<any>;
        filter?: any;
        update: any;
        options?: any;
        }) => {
        return await model.findOneAndUpdate(
            filter || {},
            { ...update, $inc: { __v: 1 } },
            {
            new: true,
            runValidators: true,
            ...options,
            }
        );
    };

    findByIdAndUpdate = async ({
        id,
        update,
        options = { new: true },
        model,
        }: {
        id: string;
        update: any;
        options?: any;
        model: Model<any>;
        }) => {
        return await model.findByIdAndUpdate(
            id,
            { ...update, $inc: { __v: 1 } },
            {
            ...options,
            runValidators: true,
            }
        );
    };

    deleteOne = async ({
    filter,
    model,
    }: {
    filter?: any;
    model: Model<any>;
    }) => {
    return await model.deleteOne(filter || {});
    };

    deleteMany = async ({
        filter,
        model,
        }: {
        filter?: any;
        model: Model<any>;
        }) => {
        return await model.deleteMany(filter || {});
    };

    findOneAndDelete = async ({
        filter,
        model,
        }: {
        filter?: any;
        model: Model<any>;
        }) => {
        return await model.findOneAndDelete(filter || {});
    };

}
