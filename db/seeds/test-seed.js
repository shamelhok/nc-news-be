const devData = require('../data/test-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

const testSeed = () => {
  return seed(devData).then(() => db.end());
};

testSeed();