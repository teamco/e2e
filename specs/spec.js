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
      // TODO (Tkachv): Dom something
    },
    beforeEach() {
      // TODO (Tkachv): Dom something
    },
    afterAll() {
      // TODO (Tkachv): Dom something
    },
    afterEach() {
      // TODO (Tkachv): Dom something
    }
  });

  require('./general/general.spec');
});
