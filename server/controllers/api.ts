import * as express from 'express';
import * as passport from 'passport';
import { userGuard } from '../my.guard';

import { TimesheetCollection } from '../models/timesheet';

const router = express.Router();

router.get('/', (req, res) => {
  new Promise(resolve => {
    setTimeout(() => resolve(res.send('test')), 2000);
  });
});

router.get('/mongotest', userGuard, async (req, res) => {
  const ret = await TimesheetCollection.find().exec();
  res.json(ret);
});

router.post('/auth/login', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(null);
  res.send('ok');
});

export const ApiCtrl = router;
