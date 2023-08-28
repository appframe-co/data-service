import Data from '@/models/data.model';
import {TErrorResponse} from '@/types/types';

export default async function DataList(
    {userId, projectId, structureId}: {userId: string, projectId: string, structureId?: string|null}): 
    Promise<TErrorResponse | {data: any}>
{
    try {
        const filter: any = {userId, projectId};
        if (structureId) {
            filter['structureId'] = structureId;
        }
        const data = await Data.find(filter);
        if (!data) {
            return {error: 'invalid_data'};
        }

        return {data};
    } catch (error) {
        throw error;
    }
}