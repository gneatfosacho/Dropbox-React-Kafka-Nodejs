var mongoose     = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema       = mongoose.Schema;


var GroupSchema   = new Schema({

    'groupname': String,
    'membercount': Number,
    'owner': String,
    'members': Array

});

module.exports = mongoose.model('Group', GroupSchema);
