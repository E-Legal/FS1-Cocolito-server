const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error DB connexion'));
db.once('open', function (){
    console.log("Connexion DB success");
});
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model'),
};