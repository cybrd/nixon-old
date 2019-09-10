import { set, connect } from 'mongoose';

set('debug', false);
set('useCreateIndex', true);

export function setMongoDb() {
  const db = 'mongodb://localhost:27017';

  connect(
    db,
    {
      user: 'admin',
      pass: '123qwe',
      dbName: 'nixon',
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
}
