/**
 * Created by teamco on 5/17/2017.
 */

describe('General', () => {
  s.preConfig();
  describe('Authentication', () => {
    s.preConfig();
    require('./login/login.test');
    require('./login/logout.test');
  });
});
