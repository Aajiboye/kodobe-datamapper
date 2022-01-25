const logger = require('./logger');
const MissingFieldError = require('../error-handler/MissingFieldError');

exports.requiredFieldValidator = async (expectedFields, enteredFields, correlationID) => {
  // if no field was entered
  if (enteredFields.length === 0) {
    logger.debug(`${correlationID}: Required Fields Validation failed`);
    throw new MissingFieldError(expectedFields);
  }

  // check for expected fields
  expectedFields.forEach((field) => {
    if (!enteredFields.includes(field)) {
      logger.debug(`${correlationID}: Required Fields Validation failed`);
      throw new MissingFieldError(expectedFields);
    }
  });

  return true;
};

exports.enumTypesValidator = async (inputValue, enumValues, correlationID) => {
  if (!inputValue) {
    logger.debug(`${correlationID}: Required Fields Validation failed`);
    throw new MissingFieldError([inputValue]);
  }
  const inputValueFormatted = inputValue.toUpperCase();
  if (!enumValues.includes(inputValueFormatted)) {
    throw new Error(`Invalid entry for enum values ${enumValues}`);
  }
};

exports.validateCoordinates = async (cordType, value) => {
  if(cordType === 'long'){
    if(value < -180 || value > 180 ){
      throw new Error (`invalid longitude value ${value}`)
    }
  }
    if( cordType === 'lat') {
      if(value < -90 || value > 90){
        console.log('here')
        throw new Error (`invalid latitude value ${value}`)      
      }
    }
}