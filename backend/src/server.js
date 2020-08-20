const app = require('express')();
const connect = require('connect')
const http = require("http");
const port = process.env.PORT || 7778;

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//Instance db
const db = require("./services/db").dbConnect()

// const store = new MongoStore({mongooseConnection: db})


require("./services/middlewares").useMiddleware(app)
const Sockets = require('./wss/socket')
const index = require('./router/index');

app.use(index);

class Server {
  constructor() {
    this.http = http.createServer(app)    
    this.sockets = new Sockets(this.http).listenToEvents()
  }

  listen() {
    this.http.listen(port)
	  console.log('Magic happens on port ' + port);
  }
}

new Server().listen()
