/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose = require('mongoose');

const startConnection = require('../migration-connection-factory.js');

const model = startConnection('countries', 'country');

/**
 * Make any changes you need to make to the database here
 */
async function up() {
  const res = (await model).aggregate([
    {
      $project: {
        alias: { $objectToArray: '$translations' },
        iso2: '$iso2',
        iso3: '$iso3',
        name: '$name'
      }
    }
  ]);

  for await (const item of res) {
    const arrAlias = await item.alias.map((obj) => obj.v);
    arrAlias.push(item.name);
    arrAlias.push(item.iso2);
    arrAlias.push(item.iso3);
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
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
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
}

module.exports = { up, down };
