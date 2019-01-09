/**
 * Created by Tkachv on 5/17/2017.
 */

/**
 * Simplify services
 * @type {Services}
 */

const services = require('../services/main');
global.s = services.e2e;

describe('E2E tests', () => {
  require('./general/spec');
});
