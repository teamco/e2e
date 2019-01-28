/**
 * Created by tkachv on 5/15/2017.
 */

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
   * @returns {!Thenable<R>}
   * @example
   * const $import = await s.getElementBy('css', '.anticon-file-add');
   * await s.button.press($import);
   */
  this.press = ($locator, callback) =>
      s.waitForClickable($locator).then(() =>
          s.executeCallbackPromise(
              s.browser.clickOnElement($locator), false, callback));

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

    s.isPromise($locator) ?
        $locator.then($locator => _validate($locator, disabled)) :
        _validate($locator, disabled);
  };
};

module.exports = new Button();
