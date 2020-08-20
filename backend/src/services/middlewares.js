const cors = require("cors")
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
const keys = require('../../config/keys');
const express = require('express');

const session = require('express-session');


//Import REST passport strategy
require('./passport');


const useMiddleware = (app) => {


	//Log REST API

	app.use(morgan('dev')); // log requests to the console
	
	//Cross scripting request

	app.use(cors())
	//JSON Parser for REST API

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	
	// REST Auth Cookie

	app.use(
		cookieSession({
		maxAge: 30 * 24 * 60 * 1000,
		keys: [keys.cookieKey]
		})
	)
	//Init REST Strategy

	app.use(passport.initialize());
	app.use(passport.session());
	

	// Display image
	const publicDir = require('path').join(__dirname,'/public');
	app.use(express.static(publicDir));

	// //WSS Session
	// app.use(session({
	// 	secret: keys.cookieKey,
	// 	resave: true,
	// 	saveUninitialized: false,
	// 	store: store,
	// 	ttl: 1 * 24 * 60 * 60,
	// 	autoRemove: 'native'
	// }));

	//Set 
	// app.use(express.session({ store: session }));
}
module.exports = {useMiddleware}