import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { setMongoDb } from './my.mongoose';
import { setSession } from './my.session';
import { setPassport } from './my.passport';
import { router } from './router';

const myExpress = express();
const port = 3000;

myExpress.use(bodyParser.urlencoded({ extended: false }));
myExpress.use(bodyParser.json());
myExpress.use(express.static(path.join(__dirname, '../dist')));

setMongoDb();
setSession(myExpress);
setPassport(myExpress);

myExpress.use(router);

myExpress.all('/*', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/../dist' });
});

myExpress.listen(port, () => console.log(`App listening on port ${port}!`));
