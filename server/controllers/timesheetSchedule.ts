import { Router } from 'express';

import { userGuard } from '../my.guard';

import { list, summary } from '../services/timesheetSchedule';

const router = Router();

router.post('/list', userGuard, async (req, res) => {
  res.send(await list(req.body));
});

router.post('/summary', userGuard, async (req, res) => {
  res.send(await summary(req.body));
});

export const TimesheetScheduleCtrl = router;
