/*jshint esversion: 6 */

describe('Login', () => {

  /**
   * Simplify services
   * @type {Services}
   */
  const s = require('./../../../../services/main.js').e2e;

  it('Negative: Invalid payload', () => s.login.doLogin(s.login.TYPE.negative.name, {
    userName: 'username',
    password: 'password'
  }));

  it('Negative: Empty payload', () => s.login.doLogin(s.login.TYPE.empty.name, {
    userName: '',
    password: ''
  }));

  it('Positive', () => s.login.doLogin(s.login.TYPE.positive.name));
});
