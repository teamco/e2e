/**
 * Created by teamco on 5/17/2017.
 */

const services = require('../../services/main');

/**
 * @global
 * @type {Services|{browser, input, checkbox, button}}
 */
global.s = services.e2e;

describe('General', () => {

  s.preConfig({
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

  require('./anthill/login.test');
  require('./anthill/design.test');
});
