import Data from '@/models/data.model';
import { TErrorResponse } from '@/types/types';

export default async function UpdateData(
    {userId, projectId, body}: any): Promise<TErrorResponse | any> {
    try {
        if (!body.id) {
            return {error: 'invalid_request'};
        }

        const data: any  = await Data.findOneAndUpdate({
            userId, 
            projectId, 
            _id: body.id
        }, body);
        if (!data) {
            return {error: 'invalid_data'};
        }

        return {data};
    } catch (error) {
        throw error;
    }
}