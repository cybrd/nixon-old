import { join } from 'path';
import * as express from 'express';
import { urlencoded, json } from 'body-parser';
import * as morgan from 'morgan';

import { setMongoDb } from './my.mongoose';
import { setSession } from './my.session';
import { setPassport } from './my.passport';
import { router } from './router';

const app = express();
const port = 3000;

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(express.static(join(__dirname, '../dist')));

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

app.all('/*', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/../dist' });
});

app.listen(port, () =>
  process.stdout.write(`App listening on port ${port}!\n`)
);
