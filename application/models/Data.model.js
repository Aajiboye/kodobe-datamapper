/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const { Schema } = mongoose;

const autoIncrementModelID = require('./Counter.model');

// DDM => Data Definition Model. Takes care of the data type per provider
const DataSchema = mongoose.Schema({
  providerId: {
    type: Number,
    required: true,
  },
  customId: String,
  data: Schema.Types.Mixed,
  deleted: {
    type: Boolean,
    default: false,
    select: false,
  },
},
  {
    timestamps: true,
  });
DataSchema.pre('find', function () {
  this.where({ deleted: false });
  this.sort({ createdAt: -1 });
});

DataSchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID('applicationCount', 'customId', this, next, 'DTA');
});
module.exports = mongoose.model('data', DataSchema);
