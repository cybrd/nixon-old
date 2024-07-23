import { set, connect } from 'mongoose';
import { config } from 'dotenv';
config();

set('debug', false);

export function setMongoDb() {
  return connect(process.env.MONGODB_URI, {
    dbName: 'nixon',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
