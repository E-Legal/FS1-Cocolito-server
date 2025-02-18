const expressJwt = require('express-jwt');
const config = require('../config.json');
const userService = require('../users/user.service');

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub);

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }

  done();
}

function jwt() {
  const { secret } = config;
  return expressJwt({ secret, isRevoked }).unless({
    path: [
      // public routes that don't require authentication
      '/users/login',
      '/users/register',
    ],
  });
}

module.exports = jwt;
