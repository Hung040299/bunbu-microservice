const register = require('../models/dbPostgreSQL')
const register_model = new register()
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const { getByEmail } = require('../models/login.model')
require('dotenv').config()

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    async function (accessToken, refreshToken, profile, done) {
      const { email, picture } = profile._json;
      const userData = {
        email,
        user_name: profile.displayName,
        link_img: picture.data.url,
        role_id: 2
      };
      const account = await getByEmail(email)
      if (account == null) {
        register_model.register(userData, (account_id) => {
          return account_id
        })
      }

      done(null, profile);
    }
  )
);
