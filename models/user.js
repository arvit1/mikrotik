// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var conn = require('../mongo');

var Router = require('./router.js').RouterSchema;

// create a schema
var UserSchema = new Schema({
    id          : ObjectId,
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    routers: [Router],
    created_at: Date,
    updated_at: Date
});

UserSchema.pre('save', function (next) {
    this.created_at = Date.now();
    for (router in this.routers) {
        
    }
    next();
});

module.exports = {
    User: conn.model('User', UserSchema),
    UserSchema: UserSchema
}