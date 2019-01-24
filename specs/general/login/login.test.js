import {login, resetLogin} from '../../helpers/login';
import {navigateTo} from '../../helpers/general';

describe('Login', () => {
  s.preConfig();
  navigateTo('http://localhost:5000', 'AntHill');
  resetLogin();
  login('', '', false);
  login('email@gmail.com', '1234567890');
});