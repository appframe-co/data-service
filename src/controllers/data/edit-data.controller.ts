import Data from '@/models/data.model';
import { TData, TDataInput, TDoc, TErrorResponse, TStructure } from '@/types/types';

function isErrorStructure(data: TErrorResponse|{structure: TStructure}): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

export default async function UpdateData(dataInput: TDataInput): Promise<TErrorResponse | {data: TData}> {
    try {
        const {id, projectId, structureId, createdBy, updatedBy, doc: docInput} = dataInput;

        if (!id) {
            throw new Error('id required');
        }

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
        const structureFetch: {structure: TStructure}|TErrorResponse = await resFetchStructure.json();
        if (isErrorStructure(structureFetch)) {
            throw new Error('Error structure');
        }

        const {structure} = structureFetch;

        // compare data by structure
        const codes = structure.bricks.map(b => b.code);
        const doc: TDoc = {};
        if (docInput) {
            codes.forEach(code => {
                doc[code] = docInput.hasOwnProperty(code) ? docInput[code] : null;
            });
        }

        const updatedData: TData|null  = await Data.findOneAndUpdate({
            createdBy, 
            projectId,
            _id: id
        }, {updatedBy, doc});
        if (!updatedData) {
            throw new Error('invalid data');
        }

        return {data: updatedData};
    } catch (error) {
        throw error;
    }
}