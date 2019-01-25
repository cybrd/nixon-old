import { set, connect } from 'mongoose';

set('debug', false);
set('useCreateIndex', true);

export function setMongoDb() {
  const db = 'mongodb://localhost:27017';
  const options = {
    user: 'admin',
    pass: '123qwe',
    auth: {
      authdb: 'admin'
    },
    dbName: 'nixon',
    useNewUrlParser: true
  };

  connect(
    db,
    options
  );
}
