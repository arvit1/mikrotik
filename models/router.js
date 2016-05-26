var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var conn = require('../mongo');

var RouterSchema = new Schema({
    id          : ObjectId,
    name        : {type: String, required: true},
    ip          : { type: String, unique: true },
    username    : String,
    password    : String
});

module.exports = {
    Router: conn.model('Router', RouterSchema),
    RouterSchema: RouterSchema    
}