import express, { Request, Response, NextFunction } from 'express';
import DataListController from '@/controllers/data/data-list.controller'
import NewDataController from '@/controllers/data/new-data.controller'
import EditDataController from '@/controllers/data/edit-data.controller'
import DeleteDataController from '@/controllers/data/delete-data.controller'
import DataController from '@/controllers/data/data.controller'

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.query as {userId: string, projectId: string};

        const data = await DataListController({
            userId,
            projectId,
            structureId: req.query.structureId as string
        });

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let {userId, projectId, structureId, doc}  = req.body;

        const data = await NewDataController({
            userId,
            projectId,
            structureId,
            doc
        });

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.query as {userId: string, projectId: string};
        let body = req.body;

        const data = await EditDataController({
            userId,
            projectId,
            body
        });

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.query as {userId: string, projectId: string};
        const { id } = req.params;

        const data = await DataController({
            userId,
            projectId,
            id
        });

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.query as {userId: string, projectId: string};
        const { id } = req.params;

        const data = await DeleteDataController({
            userId,
            projectId,
            id
        });

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;