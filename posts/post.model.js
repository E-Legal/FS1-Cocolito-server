const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    username: { type: String},
    createdDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
    user_id: {type : Object},
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Post', schema);