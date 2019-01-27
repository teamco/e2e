import {login} from '../../helpers/login';
import {navigateTo} from '../../helpers/general';

describe('Login', () => {
  s.preConfig();
  navigateTo(s.specConfig.baseUrl, s.specConfig.title);
  //resetLogin();
  //login('', '', false);
  login(s.specConfig.credentials.user, s.specConfig.credentials.password);
});