import {navigateTo} from '../helpers/general';
import {login} from '../helpers/login';

describe('Design', () => {
  s.preConfig();

  const baseUrl = 'http://localhost:5000';
  const title = 'AntHill';

  navigateTo(baseUrl, title);
  login('email@gmail.com', '1234567890');
  navigateTo(`${baseUrl}/sites/shared/development`, title);
});