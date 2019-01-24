import {navigateTo} from '../helpers/general';
import {login} from '../helpers/login';

describe('Design', () => {
  s.preConfig();

  const baseUrl = s.specConfig.baseUrl;

  navigateTo(baseUrl, title);
  login(s.specConfig.credentials.user, s.specConfig.credentials.password);
  navigateTo(`${baseUrl}/sites/shared/development`, s.specConfig.title);
});