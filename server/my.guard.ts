import { Request, Response, NextFunction } from 'express';

export function userGuard(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).send('please relog');
  } else {
    next();
  }
}

export function supervisorGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    res.status(401).send('please relog');
  } else if (req.user.role !== 'admin' && req.user.role !== 'supervisor') {
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
