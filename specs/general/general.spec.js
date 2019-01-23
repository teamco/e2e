/**
 * Created by teamco on 5/17/2017.
 */

/**
 * @constant
 * @type {Services}
 */
const services = require('../../services/main');

/**
 * @global
 * @type {Services|{browser, input, checkbox, button}}
 */
global.s = services.e2e;

describe('General', () => {

  s.preConfig();

  require('./anthill/login.test');
  require('./anthill/design.test');
});
