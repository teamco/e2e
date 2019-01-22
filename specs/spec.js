/**
 * Created by teamco on 5/17/2017.
 */

/**
 * Simplify services
 * @type {Services}
 */

const services = require('../services/main');
global.s = services.e2e;

describe('E2E tests', () => {

  global.s.preConfig({
    beforeAll() {
      // TODO (teamco): Do something
    },
    beforeEach() {
      // TODO (teamco): Do something
    },
    afterAll() {
      // TODO (teamco): Do something
    },
    afterEach() {
      // TODO (teamco): Do something
    }
  });

  require('./general/general.spec');
});
