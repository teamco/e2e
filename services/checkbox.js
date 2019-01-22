/**
 * Created by tkachv on 5/15/2017.
 */

/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * Checkbox
 * @constructor
 */
const Checkbox = function() {

  /**
   * @memberOf Checkbox
   * @param $locator
   * @returns {Promise<void>}
   */
  this.toggle = async $locator => await s.e2e.browser.clickOnElement($locator);
};

module.exports = new Checkbox();
