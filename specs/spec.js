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

  global.s.preConfig({
    beforeAll() {
      // TODO (Tkachv): Do something
    },
    beforeEach() {
      // TODO (Tkachv): Do something
    },
    afterAll() {
      // TODO (Tkachv): Do something
    },
    afterEach() {
      // TODO (Tkachv): Do something
    }
  });

  require('./general/general.spec');
});
