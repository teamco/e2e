/**
 * Created by tkachv on 5/15/2017.
 */

/**
 * Input
 * @constructor
 */
const Input = function() {

  /**
   * isDisabled
   * @method Input.isDisabled
   * @property Input
   * @param {WebElement} $locator
   * @param {boolean} disabled
   */
  this.isDisabled = function($locator, disabled) {
    expect($locator.isEnabled()).toBe(disabled);
  };

  /**
   * updateValue
   * @property Input
   * @param $locator
   * @param value
   * @returns {Promise<R>}
   * @example
   * const $input = s.getElementInsideOfBy('input[type="text"]', $modal);
   * const timestamp = +(new Date());
   * await s.input.updateValue($input, `Name-${timestamp}`);
   */
  this.updateValue = ($locator, value) =>
    $locator.then(() => {
      this.verifyValue($locator);
      this.verifyValue($locator, value.toString());
    });

  /**
   * verifyValue
   * @property Input
   * @param $locator
   * @param {string} [value]
   */
  this.verifyValue = function($locator, value) {
    value = value || '';
    $locator.then($locator => {
      /**
       * _checkValue
       * @private
       */
      function _checkValue() {
        $locator.getAttribute('value').then(text => {
          expect(text).toEqual(value);
        });
      }

      s.browser.clickOnElement($locator, () => {
        value ? $locator.sendKeys(value).then(_checkValue) : $locator.clear().then(_checkValue);
      });
    });
  };

  /**
   * setValue
   * @property Input
   * @param $locator
   * @param value
   * @returns {Promise<R>}
   * @example
   * const $input = await s.getElementInsideOfBy('.ant-input', $appender);
   * await s.input.setValue($input, newData.tags[0]);
   */
  this.setValue = async ($locator, value) => {
    await this.verifySetValue($locator);
    await this.verifySetValue($locator, value.toString());
  };

  /**
   * verifySetValue
   * @property Input
   * @param $locator
   * @param {string} [value]
   */
  this.verifySetValue = async ($locator, value) => {
    value = value || '';

    /**
     * _checkValue
     * @private
     */
    const _checkValue = async () => {
      const text = await $locator.getAttribute('value');
      expect(text).toEqual(value);
    };

    await s.browser.clickOnElement($locator, async () => {
      if (value) {
        await $locator.sendKeys(value);
      } else {
        await $locator.clear();
      }
      await _checkValue();
    });
  };
};

module.exports = new Input();
