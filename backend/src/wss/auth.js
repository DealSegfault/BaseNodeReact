const axios = require("axios")
class Security {
	constructor(remote_host) {
		this.remote_host = remote_host
		this.all_ip = []
		this.max_req = 10
		this.max_con = 5
		this.delay_reset = 1000 * 1
  }
  

	// Socket drop
	updateCheck = socket => {
    console.log("Disconnect Heartbeat lost")
		const address = socket.request.connection.remoteAddress

		//On disconnect reduce total con on IP
		if (this.all_ip[address]) {
			this.all_ip[address].total_con = this.all_ip[address].total_con - 1
		console.log(
			'Reduce score ' + address,
			this.all_ip[address].total_con - 1
		)
		}
  	}	


	//DDOS protection, total con per ip pattern
  runCheck = (socket, payload) => {
	//Get Time and IP
	const now = Date.now()
	const address = socket.request.connection.remoteAddress
	
	//Register new IP
    if (!this.all_ip[address]) {
	  console.log('New user ' + address)
	  
	  //Set default policies
      this.all_ip[address] = {
        total_con: 1,
        first_seen: Date.now(),
		pts: this.max_req,
		auth: false
	  }
	  
	  //Authorize new user
      return true
    } else {

	//Check existing user 
      console.log(
        'Existing user ' + address,
        'Editing score',
        this.all_ip[address].last_seen
      )

	  //Increase total con score for IP
	  this.all_ip[address].total_con = this.all_ip[address].total_con + 1
	  
	  //Check Req/min score for delay_reset
      if (now - this.all_ip[address].last_seen > this.delay_reset) {
		console.log('Time ok reset', now - this.all_ip[address].last_seen)
		
		//Allow Max_Req again
        this.all_ip[address].pts = this.max_req
	  }
	  
	  //Set last seen
	  this.all_ip[address].last_seen = now
	  
	  //Drop on max_con
      if (this.all_ip[address].total_con > this.max_con) {
        return false
      } else {
		//User have been tracked and respected the rules
        console.log(
          'Allowed',
          'First seen',
          this.all_ip[address].first_seen,
          'Total con',
          this.all_ip[address].total_con,
          'Last seen',
          this.all_ip[address].last_seen
		)
		
		//Allow User
        return true
      }
    }
  }

  //Security nbr req/min event, pts pattern
  guard = socket => {

	//Get IP and Time
    const address = socket.request.connection.remoteAddress
    const now = Date.now()

	//Give pts if delay passed
	if (now - this.all_ip[address].last_seen > this.delay_reset) {
        console.log('Time ok reset', now - this.all_ip[address].last_seen)
		this.all_ip[address].pts = this.max_req
	  }
	
	//Still have pts
    if (this.all_ip[address].pts) {

		//Reduce pts available
		this.all_ip[address].pts -= 1
		
		//Set last seen
    	this.all_ip[address].last_seen = now
		console.log('Allowed', 'Pts', this.all_ip[address].pts)
		
		//Allow request
    	return true
    } else {
      //ACK Rate limit
      const message = {
        status: false,
        message: 'Rate limited',
        last_seen: now,
        wait: this.delay_reset
      }
	  // console.log("Rate limited" , message)
	  
	  //Always force new delay until rules followed
	  this.all_ip[address].last_seen = now
	  
	  //ACK Front Rate limit
	  socket.emit('rate-limit', { message })
	  
	  //Drop Request
      return false
    }
  }
}

module.exports = Security
