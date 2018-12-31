import { Router } from 'express';

import { userGuard, adminGuard } from '../my.guard';

import {
  list,
  listPopulated,
  create,
  update,
  remove
} from '../services/employeeSchedule';

const router = Router();

router.post('/list', userGuard, async (req, res) => {
  res.send(await list(req.body));
});

router.post('/listPopulated', userGuard, async (req, res) => {
  res.send(await listPopulated(req.body));
});

router.post('/create', adminGuard, async (req, res) => {
  res.send(await create(req.user, req.body));
});

router.post('/:id/remove', adminGuard, async (req, res) => {
  res.send(await remove(req.user, req.params.id));
});

router.post('/:id/update', adminGuard, async (req, res) => {
  const result = await update(req.user, req.params.id, req.body);
  res.send(result);
});

export const EmployeeScheduleCtrl = router;
