import { Router } from 'express';
import { writeFileSync } from 'fs';
import * as multer from 'multer';
import * as dateformat from 'dateformat';

// tslint:disable-next-line:no-var-requires
const reader = require('anviz-backup-reader');

import { userGuard, adminGuard } from '../my.guard';

import {
  list,
  create,
  createFromUpload,
  update,
  remove
} from '../services/timesheet';

const router = Router();

router.post('/list', userGuard, async (req, res) => {
  res.send(await list(req.body));
});

router.post('/create', adminGuard, async (req, res) => {
  res.send(await create(req.user, req.body));
});

router.post(
  '/upload',
  adminGuard,
  multer().single('file'),
  async (req, res) => {
    const filename =
      './logs/timesheet' + dateformat(new Date(), 'yyyymmddhhMMss');
    writeFileSync(filename, req.file.buffer);

    const records = reader.readFileSync(filename);
    res.send(await createFromUpload(req.user, records));
  }
);

router.post('/:id/remove', adminGuard, async (req, res) => {
  res.send(await remove(req.user, req.params.id));
});

router.post('/:id/update', adminGuard, async (req, res) => {
  const result = await update(req.user, req.params.id, req.body);
  res.send(result);
});

export const TimesheetCtrl = router;
