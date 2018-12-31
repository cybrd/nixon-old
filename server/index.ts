import { join } from 'path';
import * as express from 'express';
import { urlencoded, json } from 'body-parser';

import { setMongoDb } from './my.mongoose';
import { setSession } from './my.session';
import { setPassport } from './my.passport';
import { router } from './router';

const myExpress = express();
const port = 3000;

myExpress.use(urlencoded({ extended: false }));
myExpress.use(json());
myExpress.use(express.static(join(__dirname, '../dist')));

setMongoDb();
setSession(myExpress);
setPassport(myExpress);

myExpress.use(router);

myExpress.all('/*', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/../dist' });
});

myExpress.listen(port, () =>
  process.stdout.write(`App listening on port ${port}!\n`)
);
