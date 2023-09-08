import Data from '@/models/data.model';
import {TData, TDataInput, TErrorResponse, TStructure, TStorage, TDoc} from '@/types/types';

function isErrorStructure(data: TErrorResponse|{structure: TStructure}): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

export default async function DataController(dataInput: TDataInput): Promise<TErrorResponse | {data: TData}> {
    try {
        const {id, projectId, createdBy, structureId} = dataInput;

        const data = await Data.findOne({createdBy, projectId, _id: id});
        if (!data) {
            throw new Error('invalid data');
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
 
        // GET storage
        const resFetchStorage = await fetch(
            `${process.env.URL_STORAGE_SERVICE}/api/storage?projectId=${projectId}&subjectId=${data.id}&subjectType=data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const {storage} = await resFetchStorage.json();

        // MERGE storage with data
        for (const s of storage) {
            if (data.doc.hasOwnProperty(s.subjectField) && data.doc[s.subjectField]) {
                data.doc[s.subjectField].push(s);
                continue;
            }
            data.doc[s.subjectField] = [s];
        }

        // compare data by structure
        const codes = structure.bricks.map(b => b.code);
        const doc: TDoc = {};
        if (data.doc) {
            codes.forEach(code => {
                doc[code] = data.doc.hasOwnProperty(code) ? data.doc[code] : null;
            });
        }

        const output = {
            id: data.id,
            projectId: data.projectId,
            structureId: data.structureId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            createdBy: data.createdBy,
            updatedBy: data.updatedBy,
            doc
        };
        return {data: output};
    } catch (error) {
        console.log(error)
        throw error;
    }
}