import {login} from '../../helpers/login';
import {navigateTo} from '../../helpers/general';

describe('Login', () => {

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

  navigateTo('http://localhost:5000', 'AntHill');
  login('email@gmail.com', '1234567890');
});