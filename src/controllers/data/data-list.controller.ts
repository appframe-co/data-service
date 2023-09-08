import Data from '@/models/data.model';
import {TData, TDataInput, TDoc, TErrorResponse, TStorage, TStructure} from '@/types/types';

function isErrorStructure(data: TErrorResponse|{structure: TStructure}): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

export default async function DataList(dataInput: TDataInput): Promise<TErrorResponse | {data: TData[], names: string[], codes: string[]}>{
    try {
        const {projectId, structureId, createdBy} = dataInput;

        if (!createdBy || !projectId || !structureId) {
            throw new Error('createdBy & projectId & structureId query required');
        }

        const filter = {createdBy, projectId, structureId};

        const data: TData[] = await Data.find(filter);
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

        // MERGE storage with data
        for (const d of data) {
            const resFetchStorage = await fetch(
                `${process.env.URL_STORAGE_SERVICE}/api/storage?projectId=${projectId}&subjectId=${d.id}&subjectType=data`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const {storage}: {storage: TStorage[]} = await resFetchStorage.json();

            for (const s of storage) {
                if (d.doc.hasOwnProperty(s.subjectField) && d.doc[s.subjectField]) {
                    d.doc[s.subjectField].push(s);
                    continue;
                }
                d.doc[s.subjectField] = [s]; 
            }
        }

        // COMPARE data by structure
        const codes = structure.bricks.map(b => b.code);
        const result = data.map((d: TData) => {
            const doc = codes.reduce((acc: TDoc, code: string) => {
                acc[code] = d.doc.hasOwnProperty(code) ? d.doc[code] : null

                return acc;
            }, {});

            return {
                id: d.id,
                projectId: d.projectId,
                structureId: d.structureId,
                createdAt: d.createdAt,
                updatedAt: d.updatedAt,
                createdBy: d.createdBy,
                updatedBy: d.updatedBy,
                doc
            };
        });
        const names = structure.bricks.map(b => b.name);

        return {data: result, names, codes};
    } catch (error) {
        throw error;
    }
}