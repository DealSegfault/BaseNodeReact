const app = require('express')();
const http = require("http");
const port = process.env.PORT || 3000;

//Instance db
const db = require("./services/db").dbConnect()

require("./services/middlewares").useMiddleware(app)
const index = require('./router/index');

app.use(index);

class Server {
  constructor() {
    this.http = http.createServer(app)
  }

  listen() {
    this.http.listen(port)
	  console.log('Magic happens on port ' + port);
  }
}

new Server().listen()
