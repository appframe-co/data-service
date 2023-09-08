import Data from '@/models/data.model';
import { TData, TDataInput, TErrorResponse } from '@/types/types';

export default async function DeleteData(dataInput: TDataInput): Promise<TErrorResponse | {}> {
    try {
        const {createdBy, projectId, id} = dataInput;

        if (!id) {
            throw new Error('invalid request');
        }

        const data: TData|null  = await Data.findOneAndRemove({
            createdBy, 
            projectId, 
            _id: id
        });
        if (!data) {
            throw new Error('invalid data');
        }

        return {};
    } catch (error) {
        throw error;
    }
}