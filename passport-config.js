const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
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
  }

  passport.use(new LocalStrategy({ usernameField: 'email', userpasswordField: 'password'}, authenticateUser));
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  });
}

module.exports = initialize;
