import * as passport from 'passport';
import { Strategy } from 'passport-local';
import * as express from 'express';

import { loginLocal } from './services/auth';

export function setPassport(myExpress: express.Express) {
  myExpress.use(passport.initialize());
  myExpress.use(passport.session());

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  passport.use(new Strategy(loginLocal));
}
