/* eslint-disable global-require */
module.exports = {
  /**
   *  port
   */
  PORT: process.env.PORT || 4000,
  APP: require('./app'),
  MONGODB_URI: process.env.MONGODB_URI,
  /**
   * Credentials for the AWS Logs
   */
   FIELDTYPES: ['Timestamp', 'Number', 'String']
};
