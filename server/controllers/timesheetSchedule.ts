import { Router } from 'express';

import { userGuard } from '../my.guard';

import { list, summary } from '../services/timesheetSchedule';

const router = Router();

router.post('/list', userGuard, async (req, res) => {
  const { secondary, ...args } = req.body;
  res.send(await list(args, secondary));
});

router.post('/summary', userGuard, async (req, res) => {
  const { secondary, ...args } = req.body;
  res.send(await summary(args, secondary));
});

export const TimesheetScheduleCtrl = router;
