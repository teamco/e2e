/**
 * Created by tkachv on 5/15/2017.
 */

/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * Button
 * @constructor
 */
const Button = function() {

  /**
   * press
   * @method Button.press
   * @property Button
   * @param $locator
   * @param {function} [callback]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.press = ($locator, callback) =>
      s.e2e.waitForClickable($locator).then(() =>
          s.e2e.executeCallbackPromise(
              s.e2e.browser.clickOnElement($locator), false, callback));

  /**
   * isDisabled
   * @method Button.isDisabled
   * @property Button
   * @param {WebElement|Promise} $locator
   * @param {boolean} disabled
   */
  this.isDisabled = ($locator, disabled) => {

    /**
     * _validate
     * @param {WebElement} $locator
     * @param {boolean} disabled
     * @private
     */
    function _validate($locator, disabled) {
      let condition = disabled.toString();
      if (!disabled) {
        condition = null;
      }
      expect($locator.getAttribute('disabled')).toBe(condition);
    }

    s.e2e.isPromise($locator) ?
        $locator.then($locator => _validate($locator, disabled)) :
        _validate($locator, disabled);
  };
};

module.exports = new Button();
