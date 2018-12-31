import {
  initialize,
  session,
  serializeUser,
  deserializeUser,
  use
} from 'passport';
import { Strategy } from 'passport-local';
import { Express } from 'express';

import { loginLocal } from './services/auth';

export function setPassport(myExpress: Express) {
  myExpress.use(initialize());
  myExpress.use(session());

  serializeUser((user, done) => done(null, user));
  deserializeUser((user, done) => done(null, user));

  use(new Strategy(loginLocal));
}
