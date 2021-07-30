const register = require('../models/dbPostgreSQL')
const register_model = new register()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getByEmail } = require('../models/login.model')
require('dotenv').config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  async function (accessToken, refreshToken, profile, done) {
    const { email, picture } = profile._json;
    const userData = {
      email: profile.emails[0].value,
      user_name: profile.displayName,
      link_img: picture,
      role_id: 2,
    };
    const account = await getByEmail(email)
    if (account == null) {
      register_model.register(userData, (account_id) => {
        return account_id
      })
    }

    done(null, profile);
  }
));
