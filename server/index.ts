import { join } from 'path';
import * as express from 'express';
import { urlencoded, json } from 'body-parser';
import * as morgan from 'morgan';

import { setMongoDb } from './my.mongoose';
import { setSession } from './my.session';
import { setPassport } from './my.passport';
import { router } from './router';

import { IUser } from './models/user';

declare module 'express-serve-static-core' {
  interface Request {
    user: IUser;
  }
}

const app = express();
const port = 3000;

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(express.static(join(__dirname, '../dist')));
app.use('/photo', express.static(join(__dirname, './photo')));

morgan.token('myDate', () => {
  return new Date().toLocaleString();
});

app.use(
  morgan(
    ':myDate :method :url :status :res[content-length] - :response-time ms'
  )
);

setMongoDb();
setSession(app);
setPassport(app);

app.use(router);

app.listen(port, () => console.log(`App listening on port ${port}!\n`));
