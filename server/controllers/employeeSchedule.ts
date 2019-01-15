import { Router } from 'express';
import { writeFileSync } from 'fs';
import * as multer from 'multer';
import * as dateformat from 'dateformat';

import { userGuard, adminGuard } from '../my.guard';

import {
  list,
  listPopulated,
  create,
  update,
  remove,
  createFromUpload
} from '../services/employeeSchedule';

const router = Router();

router.post('/list', userGuard, async (req, res) => {
  res.send(await list(req.body));
});

router.post('/listPopulated', userGuard, async (req, res) => {
  res.send(await listPopulated(req.body));
});

router.post('/create', adminGuard, async (req, res) => {
  const { dates, ...params } = req.body;
  const results = await Promise.all(
    dates.map((date: any) =>
      create(req.user, Object.assign({}, params, { date: date }))
    )
  );
  res.send(results);
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
      './logs/employeeSchedule' + dateformat(new Date(), 'yyyymmddhhMMss');
    writeFileSync(filename, req.file.buffer);

    res.send(await createFromUpload(req.user, req.file.buffer.toString()));
  }
);

export const EmployeeScheduleCtrl = router;
