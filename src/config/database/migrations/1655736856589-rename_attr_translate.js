/* eslint-disable @typescript-eslint/no-var-requires */
const startConnection = require('../migration-connection-factory.js');

const model = startConnection('countries');

/**
 * Make any changes you need to make to the database here
 */
async function up() {
  await model.updateMany(
    {},
    {
      $rename: { translations: 'alias' }
    },
    { multi: true }
  );
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  await model.updateMany(
    {},
    {
      $rename: { alias: 'translations' }
    },
    { multi: true }
  );
}

module.exports = { up, down };
