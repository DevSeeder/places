/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose = require('mongoose');

const startConnection = require('../migration-connection-factory.js');

const model = startConnection('countries', 'country');

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
            numeric_code: 'numericCode',
            phone_code: 'phoneCode',
            currency_name: 'currencyName',
            currency_symbol: 'currencySymbol'
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
    console.log(err);
    mongoose.connection.close();
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
            numericCode: 'numeric_code',
            phoneCode: 'phone_code',
            currencyName: 'currency_name',
            currencySymbol: 'currency_symbol'
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
    console.log(err);
    mongoose.connection.close();
  }
}

module.exports = { up, down };
