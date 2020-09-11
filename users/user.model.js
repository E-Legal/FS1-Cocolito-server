let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    email: {type: String, unique: true, required: true},
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    member: {type : Boolean, default: false},
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
    }
});

module.exports = mongoose.model('User', schema);