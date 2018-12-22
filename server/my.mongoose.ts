import * as mongoose from 'mongoose';

mongoose.set('debug', false);
mongoose.set('useCreateIndex', true);

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

  mongoose.connect(
    db,
    options
  );
}
