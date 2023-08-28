import Data from '@/models/data.model';
import { TErrorResponse } from '@/types/types';

export default async function DeleteData(
    {userId, projectId, id}: any): Promise<TErrorResponse | any> {
    try {
        if (!id) {
            return {error: 'invalid_request'};
        }

        const data: any  = await Data.findOneAndRemove({
            userId, 
            projectId, 
            _id: id
        });
        if (!data) {
            return {error: 'invalid_data'};
        }

        return {};
    } catch (error) {
        throw error;
    }
}