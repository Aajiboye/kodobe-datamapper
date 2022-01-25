# kodobe-datamapper

# Description
Create a web service that is accessible via REST API with JSON data transfer. The
service should support the following functionality:

1. Supports creation of a data specification for an external data for such that it
   will map fields of the external data to data types (Restrict Data type to string,
   integer and timestamp)
2. Supports retrieval of data for a particular Data Provider
3. supports definition of query rules to retrieve from data using these conditions
   - eqc: equalsIgnoreCase (string)
   - eq: equalsTo (timestamp and integer)
   - lt: lessThan timestamp and integer)
   - gt: greaterThan )any field timestamp and integer)

# Tech stack

mongodb
nodejs/ express

# installation

- Ensure nodejs is installed on your system or check out this blog to install:
  https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
- clone this repository
- set up environment
- run npm install to install all app dependencies
- run npm start / npm run dev to start server

# setting up environment

The restful API is secured with an api-key which should be passed in the request header on postman or any similar tool as x-api-key
For this app the x-api-key value is seen in the env.example file.

# DB connection

MongoDB uri string is present in the env.example file.

# Documentation

Find below a link to the published postman documentation for this API
https://documenter.getpostman.com/view/8640133/UVe9Qp9H

# routes

- define data - Data providers can define a data model.

- get data definition - returns a data definition by providerId or modelId with the id query param.

- update data definition - Update data definition by modelid

- Drop model - Hard delete or drop a data definition

- load data - based on provider id, this end point accepts data object that conforms to the model defined for that provider.

- get provider data - Supports retrieval of data for a particular Data Provider and supports retrieving of data by query rules and conditions.
