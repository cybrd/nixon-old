import { Router } from 'express';
import { adminGuard } from '../my.guard';

import { list, create, update, remove } from '../services/user';

const router = Router();

router.post('/list', adminGuard, async (req, res) => {
  res.send(await list(req.body));
});

router.post('/create', adminGuard, async (req, res) => {
  res.send(await create(req.user as any, req.body));
});

router.post('/:id/remove', adminGuard, async (req, res) => {
  res.send(await remove(req.user as any, req.params.id));
});

router.post('/:id/update', adminGuard, async (req, res) => {
  const result = await update(req.user as any, req.params.id, req.body);
  res.send(result);
});

export const UserCtrl = router;
