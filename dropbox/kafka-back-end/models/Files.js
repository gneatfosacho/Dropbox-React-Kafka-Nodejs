var mongoose     = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema       = mongoose.Schema;


var FileSchema   = new Schema({

    'filename': String,
    'filepath': String,
    'fileparent': String,
    'isfile': String,
    'owner': String,
    'sharedcount': Number,
    'sharedlist' : Array,
    'starred' : Boolean
});

module.exports = mongoose.model('File', FileSchema);
