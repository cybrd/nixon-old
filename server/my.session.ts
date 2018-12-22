import * as session from 'express-session';
import * as express from 'express';

export function setSession(myExpress: express.Express) {
  myExpress.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true
    })
  );
}
