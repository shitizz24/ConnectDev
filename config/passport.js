const jwtstrategy = require("passport-jwt").Strategy;
const extract = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const user = mongoose.model("users");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = extract.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret;

module.exports = passport => {
  passport.use(
    new jwtstrategy(opts, (jwt_payload, done) => {
      user
        .findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => {
          console.log(err);
        });
    })
  );
};
