/**
 * Created by teamco on 5/17/2017.
 */

import {doLogout} from './helpers/login';
import {navigateTo} from './helpers/general';

/**
 * Simplify services
 * @type {Services}
 */

const services = require('../services/main');
global.s = services.e2e;

describe('E2E tests', () => {

  s.preConfig({
    beforeAll() {
      // TODO (teamco): Do something
    },
    beforeEach() {
      // TODO (teamco): Do something
    },
    afterAll() {
      console.log('>>> Logout after all specs');
      navigateTo('http://localhost:5000', 'AntHill', false);
      doLogout(false);
    },
    afterEach() {
      // TODO (teamco): Do something
    }
  });

  require('./general/general.spec');
  require('./design/design.test');
});
