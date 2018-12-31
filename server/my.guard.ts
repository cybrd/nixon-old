import { Request, Response, NextFunction } from 'express';

export function userGuard(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).send('please relog');
  } else {
    next();
  }
}

export function adminGuard(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).send('please relog');
  } else if (req.user.role !== 'admin') {
    res.status(401).send('please relog');
  } else {
    next();
  }
}

export function devGuard(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).send('please relog');
  } else if (req.user.role !== 'dev') {
    res.status(401).send('please relog');
  } else {
    next();
  }
}
