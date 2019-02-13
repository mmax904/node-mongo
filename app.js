// app.js
const express = require('express');
var bodyParser = require('body-parser');

var product = require('./routes/product'); // Imports routes for the products
const question = require('./routes/question');
const app = express();

const logger = require('morgan');
const mongoose = require('mongoose');


var dev_db_url = 'mongodb://localhost:27017/nodemongo';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useFindAndModify: false });
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', err => {
  	console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
 	console.log('DB connected successfully!');
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

app.use(logger('dev'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200).json({});
    } else {
        return next();
    }
});

app.use('/products', product);
app.use('/questions', question);

app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		error: {
		  	message: err.message
		}
	});
});

const port = process.env.port || 1234;

app.listen(port, () => {
  	console.log(`Web server listening on: ${port}`);
});