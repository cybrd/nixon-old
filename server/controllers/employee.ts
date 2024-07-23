import { Router } from 'express';
import { writeFileSync } from 'fs';
import * as multer from 'multer';
import * as dateformat from 'dateformat';

import { userGuard, supervisorGuard, adminGuard } from '../my.guard';

import {
  list,
  listArchive,
  create,
  update,
  remove,
  removeArchive,
  removeMany,
  removeManyArchive,
  createFromUpload,
  changePhoto,
} from '../services/employee';

const router = Router();

router.post('/list', userGuard, async (req, res) => {
  res.send(await list(req.body));
});

router.post('/create', supervisorGuard, async (req, res) => {
  res.send(await create(req.user as any, req.body));
});

router.post('/removeMany', adminGuard, async (req, res) => {
  res.send(await removeMany(req.user as any, req.body.ids));
});

router.post('/:id/remove', adminGuard, async (req, res) => {
  res.send(await remove(req.user as any, req.params.id));
});

router.post('/listArchive', userGuard, async (req, res) => {
  res.send(await listArchive(req.body));
});

router.post('/removeManyArchive', adminGuard, async (req, res) => {
  res.send(await removeManyArchive(req.body.ids));
});

router.post('/:id/removeArchive', adminGuard, async (req, res) => {
  res.send(await removeArchive(req.params.id));
});

router.post(
  '/:id/update',
  supervisorGuard,
  multer({ dest: 'server/photo/' }).single('file'),
  async (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body));
    delete data.file;
    if (req.file) {
      await changePhoto(req.params.id, req.file);
    }
    const result = await update(req.user as any, req.params.id, data);
    res.send(result);
  }
);

router.post(
  '/upload',
  supervisorGuard,
  multer().single('file'),
  async (req, res) => {
    const filename =
      './logs/employee' + dateformat(new Date(), 'yyyymmddhhMMss');
    writeFileSync(filename, req.file.buffer);

    res.send(await createFromUpload(req.file.buffer.toString()));
  }
);

export const EmployeeCtrl = router;
