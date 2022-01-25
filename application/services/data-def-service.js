// Business logic comes in here
const DDM = require('../models/DDM.model'); // import DDM model
const logger = require('../utils/logger'); // logger
const ObjectId = require('mongoose').Types.ObjectId;
const { FIELDTYPES } = require('../config')
// here is where all data definition is done.
function getFuncName() {
  return getFuncName.caller.name;
}
// add data model
const processFieldData = fields => {
  const fieldsMap = {};
  fields.forEach((field, index) => {
    if (!FIELDTYPES.includes(field.dataType)) throw new Error(`Invalid Data Type ${field.dataType} at index ${index}`)
    fieldsMap[field.fieldName] = field.dataType
  })
  return JSON.stringify(fieldsMap);
}
const addDataDefinition = async (modelObj, correlationID) => {
  // build data map
  const { providerId, fields } = modelObj;
  // enforce data model uniqueness per provider
  const getProviderDef = await DDM.findOne({ providerId });
  if (getProviderDef) throw new Error('Sorry a data model already exists for this user cannot take duplicate entries');
  const fieldsMap = await processFieldData(fields)
  const newModel = new DDM();
  newModel.providerId = providerId;
  newModel.fields = fieldsMap;
  await newModel.save();
  logger.trace(`${correlationID}: <<<< Exiting ${getFuncName()})`);
  const response = {};
  response.data = newModel;
  response.message = 'Model added successfully';
  response.success = true;
  return response;
};

const getDataDefinition = async (id, correlationID) => {
  let getModel = {};
  if (ObjectId.isValid(id)) getModel = await DDM.findOne({ _id: id });
  else getModel = await DDM.findOne({ providerId: id });
  logger.trace(`${correlationID}: <<<< Exiting ${getFuncName()})`);
  const response = {};
  response.data = getModel || {};
  response.message = 'Model retreived successfully';
  response.success = true;
  return response;
};

const updateDefinition = async (modelid, fields, correlationID) => {
  const fieldsMap = await processFieldData(fields)
  const updateObj = { fields: fieldsMap };
  const updateModel = await DDM.findOneAndUpdate({ _id: modelid }, updateObj, { new: true });
  logger.trace(`${correlationID}: <<<< Exiting ${getFuncName()})`);
  const response = {};
  response.data = updateModel;
  response.message = 'Model updated successfully';
  response.success = true;
  return response;
};

const dropModel = async (modelId, dropType = "SOFT", correlationID) => {
  let message = 'Model dropped successfully'
  if (dropType?.toUpperCase() === 'HARD') await DDM.deleteOne({ _id: modelId });
  else {
    await DDM.findOneAndUpdate({ _id: modelId }, { deleted: true });
    message = 'Model moved to recycle bin'
  }
  logger.trace(`${correlationID}: <<<< Exiting ${getFuncName()})`);
  const response = {};
  response.data = {};
  response.message = message;
  response.success = true;
  return response;
};

const allModels = async (providerId, correlationID) => {
  const getModels = await DDM.find({ providerId });

  logger.trace(`${correlationID}: <<<< Exiting ${getFuncName()})`);
  const response = {};
  response.data = {};
  response.message = getModels;
  response.success = true;
  return response;
};

module.exports = {
  addDataDefinition,
  getDataDefinition,
  updateDefinition,
  dropModel,
  allModels,
}