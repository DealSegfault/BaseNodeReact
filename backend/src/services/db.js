const mongoose = require('mongoose');
const keys = require('../../config/keys');



const dbConnect = () => {

  // MongoDb
    mongoose.connect(`mongodb+srv://${keys.username}:${keys.password}@${keys.host}/${keys.dbname}?retryWrites=true`,{
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      console.log("DB connection alive");
    });
    return db
  }

module.exports = { dbConnect }
