import Data from '@/models/data.model';
import {TErrorResponse} from '@/types/types';

export default async function DataController(
    {userId, projectId, id}: {userId: string, projectId: string, id: string}): 
    Promise<TErrorResponse | {data: any}>
{
    try {
        const data = await Data.findOne({userId, projectId, _id: id});
        if (!data) {
            return {error: 'invalid_data'};
        }

        return {data};
    } catch (error) {
        throw error;
    }
}