const mongoose = require('mongoose');
const config = require('../config.json');

const connectionOptions = {
  useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,
};
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error DB connexion'));
db.once('open', () => {
  console.log('Connexion DB success');
});
mongoose.Promise = global.Promise;

module.exports = {
  // eslint-disable-next-line global-require
  User: require('../users/user.model'),
  // eslint-disable-next-line global-require
  Post: require('../posts/post.model'),
};
