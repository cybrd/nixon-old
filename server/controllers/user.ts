import * as express from 'express';
import { adminGuard } from '../my.guard';

import { List, Create } from '../services/user';

const router = express.Router();

router.get('/list', adminGuard, async (req, res) => {
  res.send(await List());
});

router.post('/create', adminGuard, async (req, res) => {
  res.send(await Create(req.body));
});

export const UserCtrl = router;
