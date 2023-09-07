import Data from '@/models/data.model';
import {TData, TDataInput, TErrorResponse, TStorage} from '@/types/types';

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
        const {structure} = await resFetchStructure.json();

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
                const {subjectField} = s;

                if (d.doc[subjectField].hasOwnProperty(s.subjectField)) {
                    d.doc[subjectField].push(s);
                    continue;
                }

                d.doc[subjectField] = [s]; 
            }
        }

        // COMPARE data by structure
        const codes = structure.bricks.map((b: any) => b.code);
        const result = data.map((d: TData) => {
            const doc = codes.reduce((acc: {[key: string]: any}, code: string) => {
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
        const names = structure.bricks.map((b: any) => b.name);

        return {data: result, names, codes};
    } catch (error) {
        throw error;
    }
}