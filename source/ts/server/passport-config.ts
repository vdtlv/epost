'use strict';

import passport from 'passport';
import bcrypt from 'bcrypt';
import * as passportLocal  from 'passport-local';
const LocalStrategy = passportLocal.Strategy;

interface thisUser extends Express.User {
  _id?: string;
}

export const initializePassport = (passport: passport.Authenticator, getUserByEmail: Function, getUserById: Function) => {
  const authenticateUser = async (email: string, password: string, done: Function) => {
    const user = await getUserByEmail(email);
    if(user == null) {
      return done(null, false, { message: 'Email not found' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Wrong password' });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser));
  passport.serializeUser((user: thisUser, done: Function) => done(null, user._id));
  passport.deserializeUser((id: string, done: Function) => {
    return done(null, getUserById(id))
  });
};
