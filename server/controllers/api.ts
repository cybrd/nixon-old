import { Router } from 'express';
import { authenticate } from 'passport';

const router = Router();

router.post('/auth/login', authenticate('local'), (req, res) => {
  res.json(req.user);
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(null);
  res.send('ok');
});

export const ApiCtrl = router;
