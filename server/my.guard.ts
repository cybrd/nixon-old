import { Request, Response, NextFunction } from 'express';
import { IUser } from './models/user';

export function userGuard(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).send('please relog 1');
  } else {
    next();
  }
}

export function supervisorGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user as IUser;

  if (!user) {
    res.status(401).send('please relog 2');
  } else if (user.role !== 'admin' && user.role !== 'supervisor') {
    res.status(401).send('please relog 3');
  } else {
    next();
  }
}

export function adminGuard(req: Request, res: Response, next: NextFunction) {
  const user = req.user as IUser;

  if (!user) {
    res.status(401).send('please relog 4');
  } else if (user.role !== 'admin') {
    res.status(401).send('please relog 5');
  } else {
    next();
  }
}
