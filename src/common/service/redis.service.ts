import { redisClient } from "../../DB";

type SetParams = {
    key: string;
    value: any;
    ttl?: number | undefined;
};

type KeyParam = string;

type ExpireParams = {
    key: string;
    ttl:  number ;
};

export const set = async ({ key, value, ttl }: SetParams): Promise<string | null> => {
    try {
        const data = typeof value === "string" ? value : JSON.stringify(value);

        let result: string | null;

        if (ttl) {
        result = (await redisClient.set(key, data, { EX: ttl })) as string | null;
        } else {
        result = (await redisClient.set(key, data)) as string | null;
        }

        return result ?? null;

    } catch (error) {
        console.log(`Fail in redis set Operations ${error}`);
        return null;
    }
};

export const update = async ({ key, value, ttl }: SetParams): Promise<string | null> => {
    try {
        const existsKey = await redisClient.exists(key);
        if (!existsKey) return null;

        return await set({ key, value, ttl });
    } catch (error) {
        console.log(`Fail in redis update Operations ${error}`);
        return null
    }
};

export const get = async (key: string): Promise<any > => {
    try {
        const data = await redisClient.get(key);

        if (!data) return null;

        try {
        return JSON.parse(data);
        } catch {
        return data;
        }
    } catch (error) {
        console.log(`Fail in redis get Operations ${error}`);
    }
};

export const mGet = async (keys: string[] = []): Promise<any[]> => {
    try {
        if (!keys.length) return [];

        return await redisClient.mGet(keys);
    } catch (error) {
        console.log(`Fail in redis mGet Operations ${error}`);
        return [];
    }
};

export const deleteKeys = async (keys: string[]): Promise<number> => {
    try {
        if (!keys.length) return 0;
        return await (redisClient.del as any)(...keys);
    } catch (error) {
        console.log(`Fail in redis del Operations ${error}`);
        return 0;
    }
};

export const expire = async ({ key, ttl }: ExpireParams): Promise<boolean> => {
    try {
        const result =  await redisClient.expire(key, ttl);
        return result === 1;
    } catch (error) {
        console.log(`Fail in redis expire Operations ${error}`);
        return false;
    }
};


export const increment = async (key:KeyParam ): Promise<number> => {
    try {
        return await redisClient.incr(key);
    } catch (error) {
        console.log(`FAIL IN REDIS INCREMENT OPERATIONS ${error}🫠`);
        return 0;
    }
};