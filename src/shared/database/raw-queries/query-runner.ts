import { QueryTypes } from "sequelize";
import sequelize from "../models";

async function queryRunner<T = unknown>(queryFunc: () => string, replacements: {[key: string]: any}):Promise<T> {
    try {
        const query = queryFunc();

        const options = {
            replacements,
            type: QueryTypes.SELECT,
            raw: true
        };

        const result = <T>await sequelize.query(query, options);

        return result;
    } catch (error) {
        throw error;
    }
}

export const qlit = (query) => sequelize.literal(query);

export default queryRunner;