import { Router } from 'express';
import { sign } from 'jsonwebtoken';

import { UserCollection } from '../models/user';

const router = Router();

router.post('/auth/login', (req, res) => {
  UserCollection.findOne(
    {
      username: req.body.username,
      password: req.body.password,
    },
    (err, user) => {
      if (err) {
        return res.send(err);
      }

      if (!user) {
        return res.status(401).send('invalid login');
      }

      res.send({
        username: user.username,
        role: user.role,
        token: sign(
          {
            username: req.body.username,
            password: req.body.password,
          },
          'secret'
        ),
      });
    }
  );
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(null);
  res.send('ok');
});

export const ApiCtrl = router;
