/**
 * Created by Tkachv on 5/17/2017.
 */

const services = require('../../services/main');
global.s = services.e2e;

describe('General', () => {

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

  // require('./google/google.test');
  require('./anthill/anthill.test');
});
