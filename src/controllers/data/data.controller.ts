import Data from '@/models/data.model';
import {TData, TDataInput, TErrorResponse} from '@/types/types';

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
        const {structure} = await resFetchStructure.json();
 
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
        const storageFields:any = {};
        storage.forEach((s: any) => {
            const arSrc = s.src.split('/');
            arSrc.splice(arSrc.length-1, 0, '60x60');
            const miniSrc = arSrc.join('/');

            const isField = storageFields.hasOwnProperty(s.subjectField);
            if (isField) {
                storageFields[s.subjectField].push({
                    id: s.id,
                    filename: s.filename,
                    uuidName: s.uuidName,
                    width: s.width,
                    height: s.height,
                    size: s.size,
                    mimeType: s.mimeType,
                    src: s.src,
                    miniSrc
                }); 
            } else {
                storageFields[s.subjectField] = [{
                    id: s.id,
                    filename: s.filename,
                    uuidName: s.uuidName,
                    width: s.width,
                    height: s.height,
                    size: s.size,
                    mimeType: s.mimeType,
                    mediaContentType: s.mediaContentType,
                    src: s.src,
                    miniSrc
                }]; 
            }
        });
        for (const [field, value] of Object.entries(storageFields)) {
            data.doc[field] = value;
        }

        // compare data by structure
        const codes: string[] = structure.bricks.map((b: any) => b.code);
        const doc: {[key: string]: any} = {};
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
        throw error;
    }
}