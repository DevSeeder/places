/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose = require('mongoose');

const startConnection = require('../migration-connection-factory.js');

const model = startConnection('state');

/**
 * Make any changes you need to make to the database here
 */
async function up() {
  try {
    await (
      await model
    )
      .updateMany(
        {},
        {
          $rename: {
            state_code: 'stateCode',
            country_id: 'countryId',
            country_name: 'countryName',
            country_code: 'countryCode'
          }
        },
        {
          // Strict allows to update keys that do not exist anymore in the schema
          strict: false
        }
      )
      .exec();
    mongoose.connection.close();
  } catch (err) {
    console.log('err --> ');
    mongoose.connection.close();
    throw err;
  }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  try {
    await (
      await model
    )
      .updateMany(
        {},
        {
          $rename: {
            stateCode: 'state_code',
            countryId: 'country_id',
            countryName: 'country_name',
            countryCode: 'country_code'
          }
        },
        {
          // Strict allows to update keys that do not exist anymore in the schema
          strict: false
        }
      )
      .exec();
    mongoose.connection.close();
  } catch (err) {
    console.log('err --> ');
    mongoose.connection.close();
    throw err;
  }
}

module.exports = { up, down };
