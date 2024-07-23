import { Request, Response, NextFunction } from 'express';
import { IUser } from './models/user';

export function userGuard(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).send('please relog 1111');
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
    res.status(401).send('please relog 2222');
  } else if (user.role !== 'admin' && user.role !== 'supervisor') {
    res.status(401).send('please relog 3333');
  } else {
    next();
  }
}

export function adminGuard(req: Request, res: Response, next: NextFunction) {
  const user = req.user as IUser;

  if (!user) {
    res.status(401).send('please relog 4444');
  } else if (user.role !== 'admin') {
    res.status(401).send('please relog 5555');
  } else {
    next();
  }
}
