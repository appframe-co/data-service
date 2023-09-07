import Data from '@/models/data.model';
import { TData, TDataInput, TErrorResponse } from '@/types/types';

export default async function CreateData(dataInput: TDataInput): Promise<TErrorResponse | {data: TData}> {
    try {
        const {projectId, structureId, createdBy, updatedBy, doc: docInput} = dataInput;

        if (!projectId || !structureId) {
            throw new Error('projectId & structureId required');
        }
        if (!createdBy || !updatedBy) {
            throw new Error('createdBy & updatedBy required');
        }

        // GET structure
        const resFetchStructure = await fetch(`${process.env.URL_STRUCTURE_SERVICE}/api/structures/${structureId}?userId=${createdBy}&projectId=${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const {structure} = await resFetchStructure.json();

        // compare data by structure
        const codes: string[] = structure.bricks.map((b: any) => b.code);
        const doc: {[key: string]: any} = {};
        if (docInput) {
            codes.forEach(code => {
                doc[code] = docInput.hasOwnProperty(code) ? docInput[code] : null;
            });
        }

        const newData: TData = await Data.create({...dataInput, doc});
        if (!newData) {
            throw new Error('invalid data');
        }

        return {data: newData};
    } catch (error) {
        throw error;
    }
}