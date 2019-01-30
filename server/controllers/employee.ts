import { Router } from 'express';
import { writeFileSync } from 'fs';
import * as multer from 'multer';
import * as dateformat from 'dateformat';

import { userGuard, adminGuard } from '../my.guard';

import {
  list,
  create,
  update,
  remove,
  removeMany,
  createFromUpload
} from '../services/employee';

const router = Router();

router.post('/list', userGuard, async (req, res) => {
  res.send(await list(req.body));
});

router.post('/create', adminGuard, async (req, res) => {
  res.send(await create(req.user, req.body));
});

router.post('/removeMany', adminGuard, async (req, res) => {
  res.send(await removeMany(req.user, req.body.ids));
});

router.post('/:id/remove', adminGuard, async (req, res) => {
  res.send(await remove(req.user, req.params.id));
});

router.post('/:id/update', adminGuard, async (req, res) => {
  const result = await update(req.user, req.params.id, req.body);
  res.send(result);
});

router.post(
  '/upload',
  adminGuard,
  multer().single('file'),
  async (req, res) => {
    const filename =
      './logs/employee' + dateformat(new Date(), 'yyyymmddhhMMss');
    writeFileSync(filename, req.file.buffer);

    res.send(await createFromUpload(req.user, req.file.buffer.toString()));
  }
);

export const EmployeeCtrl = router;
