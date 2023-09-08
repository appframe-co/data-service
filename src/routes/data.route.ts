import express, { Request, Response, NextFunction } from 'express';
import DataListController from '@/controllers/data/data-list.controller'
import NewDataController from '@/controllers/data/new-data.controller'
import EditDataController from '@/controllers/data/edit-data.controller'
import DeleteDataController from '@/controllers/data/delete-data.controller'
import DataController from '@/controllers/data/data.controller'
import { TDataInput } from '@/types/types';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId, structureId } = req.query as {userId: string, projectId: string, structureId: string};

        const data = await DataListController({
            createdBy: userId,
            projectId,
            structureId
        });

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let {userId, projectId, structureId, doc}: TDataInput&{userId: string} = req.body;

        const data = await NewDataController({
            projectId,
            structureId,
            createdBy: userId,
            updatedBy: userId,
            doc
        });

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let {id, userId, projectId, structureId, doc}: TDataInput&{userId: string} = req.body;

        if (req.params.id !== id) {
            throw new Error('id invalid');
        }

        const data = await EditDataController({
            id,
            projectId,
            structureId,
            createdBy: userId,
            updatedBy: userId,
            doc
        });

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId, structureId} = req.query as {userId: string, projectId: string, structureId: string};
        const { id } = req.params;

        const data = await DataController({
            createdBy: userId,
            projectId,
            structureId,
            id
        });

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.query as {userId: string, projectId: string};
        const { id } = req.params;

        const data = await DeleteDataController({
            createdBy: userId,
            projectId,
            id
        });

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

export default router;