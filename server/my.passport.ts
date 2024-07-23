import { use } from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UserCollection } from './models/user';

export function setPassport() {
  use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'secret',
      },
      (jwt_payload, done) => {
        UserCollection.findOne(
          {
            username: jwt_payload.username,
            password: jwt_payload.password,
          },
          (err, user) => {
            if (err) {
              return done(err, false);
            }

            if (!user) {
              return done(null, false);
            }

            return done(null, user);
          }
        );
      }
    )
  );
}
