var mongoose     = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema       = mongoose.Schema;


var options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 20, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};

mongoose.connect('mongodb://rahulkadam:rahulkadam7@ds159110.mlab.com:59110/cmpe273', options); // connect to our database



var UserSchema   = new Schema({

    firstname: String,
    lastname: String,
    password: Object,
    email: String,
    contactno: String,
    interests: String,
    lastlogintime: Date
    //userlog:Array
});

module.exports = mongoose.model('User', UserSchema);
