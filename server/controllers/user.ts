import { Router } from 'express';
import { adminGuard } from '../my.guard';

import { list, create, remove } from '../services/user';

const router = Router();

router.post('/list', adminGuard, async (req, res) => {
  res.send(await list(req.body));
});

router.post('/create', adminGuard, async (req, res) => {
  res.send(await create(req.body));
});

router.post('/:id/remove', adminGuard, async (req, res) => {
  res.send(await remove(req.params.id));
});

export const UserCtrl = router;
