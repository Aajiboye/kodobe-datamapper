// Business logic comes in here
const Data = require('../models/Data.model'); // import DDM model
const DDM = require('../models/DDM.model'); // import DDM model

const logger = require('../utils/logger'); // logger
// here is where all data definition is done.
function getFuncName() {
  return getFuncName.caller.name;
}
// add data model
const validTimeStamp = value => (new Date(value)).getTime() > 0; // true
const validateFieldData = (model, data) => {
  // check for invalid field entry
  const expectedFields = Object.keys(model);
  data.forEach((dataObj, index) => {
    for (const value in dataObj) {
      const fieldName = value;
      const fieldData = dataObj[value];
      // throw an error for invalid field key
      if (!expectedFields.includes(fieldName)) throw new Error(`Invalid field '${fieldName}' at index ${index}`)
      const err = `Invalid Data type for field '${value}' at index ${index}`;
      // validate for valid timestamp if field type is timestamp
      if (model[fieldName] === 'Timestamp') {
        if (!validTimeStamp(fieldData)) throw new Error(err)
      } else if (typeof fieldData !== (model[fieldName])?.toLowerCase()) {
        throw new Error(err)
      }

    }
  })

}
const addData = async (modelObj, correlationID) => {
  // perform fields validation
  const { providerId, data } = modelObj;
  const dataDef = (await DDM.findOne({ providerId }))?.fields;
  if (!dataDef) throw new Error('No Data definition for the specified provider')
  await validateFieldData(JSON.parse(dataDef), data)
  // process model object
  const insertArray = data.map(data => {
    const modifiedData = {
      data
    };
    modifiedData.providerId = providerId
    return modifiedData;
  })
  const saveData = await Data.insertMany(insertArray);
  logger.trace(`${correlationID}: <<<< Exiting ${getFuncName()})`);
  const response = {};
  response.data = saveData;
  response.message = 'Data added successfully';
  response.success = true;
  return response;
};

const getData = async (providerId, rules, correlationID) => {
  // perform fields validation
  let providerData = {};
  if (!rules) providerData = await Data.findOne({ providerId });
  else {
    const filter = queryRuleWrapper(rules);
    filter.providerId = providerId
    providerData = await Data.find(filter, { data: 1 });
  }
  logger.trace(`${correlationID}: <<<< Exiting ${getFuncName()})`);
  const response = {};
  response.data = providerData || {};
  response.message = 'Data retrieved successfully';
  response.success = true;
  return response;
};

const queryRuleWrapper = rules => {
  // this utility takes the query string and cleans it up to match mongodb query operators $eq, $lte and $gte
  const queryRulesMap = {
    eqc: '$eq',
    eq: '$eq',
    lt: '$lte',
    gt: '$gte'
  }
  const cleanedFilter = {};
  for (const field in rules) {
    if (rules[field]['eqc']) {
      cleanedFilter[`data.${field}`] = new RegExp(rules[field]['eqc'], 'i');
    } else if (rules[field]['eq']) {
      const buildQuery = {};
      buildQuery[queryRulesMap['eq']] = rules[field]['eq'];
      cleanedFilter[`data.${field}`] = buildQuery
    } else if (rules[field]['lt']) {
      const buildQuery = {};
      buildQuery[queryRulesMap['lt']] = parseInt(rules[field]['lt'], 10);
      cleanedFilter[`data.${field}`] = buildQuery
    } else if (rules[field]['gt']) {
      const buildQuery = {};
      buildQuery[queryRulesMap['gt']] = parseInt(rules[field]['gt'], 10);
      cleanedFilter[`data.${field}`] = buildQuery
    }
  }
  return cleanedFilter;

}

module.exports = {
  addData,
  getData,
}