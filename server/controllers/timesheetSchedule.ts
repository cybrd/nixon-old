import { Router } from 'express';

import { userGuard } from '../my.guard';

import { list } from '../services/timesheetSchedule';

const router = Router();

router.post('/list', userGuard, async (req, res) => {
  res.send(await list(req.body));
});

export const TimesheetScheduleCtrl = router;
