/**
 * Created by Tkachv on 5/17/2017.
 */

const services = require('../../services/main');
global.s = services.e2e;

describe('General', () => {

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

  require('./google/google.test');
});
