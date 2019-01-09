/**
 * Created by Tkachv on 5/17/2017.
 */

/*jshint esversion: 6 */
const services = require('./../../../services/main.js');

describe('Layout test', () => {

  /**
   * Simplify services
   * @type {Services}
   */
  const s = services.e2e;

  s.preConfig();

  require('./specs/tabs.test.js');
  require('./specs/navigation.test.js');
});
