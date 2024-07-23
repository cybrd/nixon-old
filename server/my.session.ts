import * as session from 'express-session';
import { Express } from 'express';

export function setSession(myExpress: Express) {
  myExpress.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      proxy: true,
      name: 'backend',
    })
  );
}
