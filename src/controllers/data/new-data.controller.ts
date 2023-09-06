import Data from '@/models/data.model';
import { TErrorResponse } from '@/types/types';

export default async function CreateData({userId, projectId, structureId, doc}: any): Promise<TErrorResponse | any> {
    try {
        const data = await Data.create({
            userId, 
            projectId,
            structureId,
            doc
        });
        if (!data) {
            return {error: 'invalid_data'};
        }

        const output = data;

        return {data: output};
    } catch (error) {
        throw error;
    }
}