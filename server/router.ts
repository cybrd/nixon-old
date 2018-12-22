import * as express from 'express';

import { ApiCtrl } from './controllers/api';
import { UserCtrl } from './controllers/user';

export const router = express.Router();

router.use('/api', ApiCtrl);
router.use('/api/user', UserCtrl);
