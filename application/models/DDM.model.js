/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const autoIncrementModelID = require('./Counter.model');

// DDM => Data Definition Model. Takes care of the data type per provider
const DDMSchema = mongoose.Schema({
  providerId: {
    type: Number,
    unique: true,
    sparse: true, 
    required: true,
  },
  customId: String,
  fields: String,
  deleted:{
    type: Boolean,
    default:false,
    select: false,
},
}, 
{
  timestamps: true,
});
DDMSchema.pre('find', function () {
  this.where({ deleted: false });
  this.sort({ createdAt: -1 });
});

DDMSchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID('applicationCount', 'customId', this, next, 'MDL');
});
module.exports = mongoose.model('data-definition', DDMSchema);
