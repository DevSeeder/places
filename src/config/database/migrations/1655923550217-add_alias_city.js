/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose = require('mongoose');

const startConnection = require('../migration-connection-factory.js');

const model = startConnection('cities', 'city');

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
          $set: {
            alias: []
          }
        }
      )
      .exec();

    const res = (await model).find({});

    for await (const item of res) {
      const arrAlias = [];
      arrAlias.push(item.name);
      await (
        await model
      )
        .findByIdAndUpdate(item._id, {
          $set: {
            alias: arrAlias
          }
        })
        .exec();
    }

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
          $set: {
            alias: []
          }
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
