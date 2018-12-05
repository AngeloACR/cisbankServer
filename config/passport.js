const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../users/models/user');
const config = require('./database');

module.exports = function(passport){
	let opts ={};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = config.authSecret;
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		User.getUserById(jwt_payload._doc._id, (err, user) => {
			if(err){
				return done(err, false);
			};

			if(user){
				return done(null, user);
			} else{
				return done(null, false);
			};
		});
	}));
}; 