import * as express from 'express';

export function userGuard(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (!req.user) {
    res.status(401).send('please relog');
  } else {
    next();
  }
}

export function adminGuard(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (!req.user) {
    res.status(401).send('please relog');
  } else if (req.user.role !== 'admin') {
    res.status(401).send('please relog');
  } else {
    next();
  }
}

export function devGuard(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (!req.user) {
    res.status(401).send('please relog');
  } else if (req.user.role !== 'dev') {
    res.status(401).send('please relog');
  } else {
    next();
  }
}
