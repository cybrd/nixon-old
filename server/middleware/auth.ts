import { authenticate } from 'passport';
import { RequestHandler } from 'express';

export const auth: RequestHandler = (req, res, next) => {
  authenticate('jwt', (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).send('wrong jwt');
    }

    req.user = user;
    next();
  })(req, res, next);
};
