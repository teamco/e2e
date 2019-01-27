/**
 * Created by teamco on 5/17/2017.
 */

import {disableAngular} from './helpers/general';

/**
 * Simplify services
 * @type {Services}
 */
const services = require('../services/main');
global.s = services.e2e;

describe('E2E tests', () => {

  s.specConfig = {
    baseUrl: 'http://localhost:5000',
    title: 'AntHill',
    credentials: {
      user: 'email@gmail.com',
      password: '1234567890'
    }
  };

  s.preConfig({
    beforeAll() {
      // TODO (teamco): Do something
    },
    beforeEach() {
      // TODO (teamco): Do something
    },
    afterAll() {
      console.log('>>> Logout after all specs');
      // navigateTo(s.specConfig.baseUrl, s.specConfig.title, false);
      // doLogout(false);
    },
    afterEach() {
      // TODO (teamco): Do something
    }
  });

  disableAngular();

  require('./general/general.spec');
  //require('./design/design.test');
});
