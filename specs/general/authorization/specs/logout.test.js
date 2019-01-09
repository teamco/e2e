/*jshint esversion: 6 */
describe('Logout', () => {

  /**
   * Simplify services
   * @type {Services}
   */
  const s = require('./../../../../services/main.js').e2e;

  it('Do logout', () => s.login.doLogout());
});