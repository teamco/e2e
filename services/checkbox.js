/**
 * Created by tkachv on 5/15/2017.
 */

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
  this.toggle = async $locator => await s.browser.clickOnElement($locator);

  /**
   * @memberOf Checkbox
   * @param $locator
   * @param check
   * @returns {Promise<boolean>}
   */
  this.check = async ($locator, check = true) => {
    let checked = await $locator.isSelected();
    if ((checked && check) || (!checked && !check)) {
      return false;
    }
    s.checkbox.toggle($locator);
    checked = await $locator.isSelected();
    expect(checked).toBe(check);
  };
};

module.exports = new Checkbox();
