let express = require('express');
let app = express();
//let cors = require('cors');
let bodyParser = require('body-parser');
let jwt = require('./_helpers/jwt');
let errorHandler = require('./_helpers/error-handler');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/posts', require('./posts/posts.controller'));


// global error handler
app.use(errorHandler);

// start server
let port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 9000;
let server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});