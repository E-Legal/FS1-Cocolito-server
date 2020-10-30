const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  member: { type: Boolean, default: false },
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    // eslint-disable-next-line no-underscore-dangle
    delete ret._id;
    delete ret.password;
  },
});

module.exports = mongoose.model('User', schema);
