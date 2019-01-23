import {login} from '../../helpers/login';
import {navigateTo} from '../../helpers/general';

describe('Login', () => {

  s.preConfig();

  navigateTo('http://localhost:5000', 'AntHill');
  login('email@gmail.com', '1234567890');
});