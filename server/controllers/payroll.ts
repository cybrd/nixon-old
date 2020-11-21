import { Router } from 'express';

import { userGuard, supervisorGuard, adminGuard } from '../my.guard';

import { list, create, update, remove } from '../services/payroll';

const router = Router();

router.post('/list', userGuard, async (req, res) => {
  res.send(await list(req.body));
});

router.post('/create', userGuard, async (req, res) => {
  res.send(await create(req.user, req.body));
});

router.post('/:id/remove', supervisorGuard, async (req, res) => {
  res.send(await remove(req.user, req.params.id));
});

router.post('/:id/update', supervisorGuard, async (req, res) => {
  const result = await update(req.user, req.params.id, req.body);
  res.send(result);
});

export const PayrollCtrl = router;
