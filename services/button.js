/**
 * Created by tkachv on 5/15/2017.
 */

import {CLASS_NAMES} from '../specs/common/constants';
import {_filterByText} from '../specs/flow/specs/helpers';

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

  /**
   * toggleMaximize
   * @method Button.toggleMaximize
   * @property Button
   * @param {boolean} maximize
   */
  this.toggleMaximize = maximize => {
    s.e2e.selectors.controlTile().then(() =>
        s.e2e.selectors.fullScreenButton().then($maximize =>
            this.press($maximize).then(() =>
                s.e2e.browser.isFullScreen().then(_fs =>
                    expect(maximize).toEqual(!!_fs)))));
  };

  /**
   * getMenuButtonList
   * @method Button.getMenuButtonList
   * @property Button
   * @param {WebElement} $locator
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.getMenuButtonList = $locator =>
      s.e2e.getSibling($locator, 'ul').then($menu => {
        this.press($locator, () => s.e2e.waitForDisplayed($menu));
        return $menu;
      });

  /**
   * getMenuButtonItem
   * @method Button.getMenuButtonItem
   * @property Button
   * @param $locator
   * @param {number} index
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.getMenuButtonItem = ($locator, index) =>
      this.getMenuButtonList($locator).then($menu => {
        const $list = s.e2e.getElementsBy('css', 'li a', $menu);
        return s.e2e.waitForClickable($list.get(index));
      });

  /**
   * buttonCallback
   * @method Button.buttonCallback
   * @property Button
   * @param {string} css
   * @param {function} callback
   */
  this.buttonCallback = (css, callback) => this.getButton(css).then($button =>
      s.e2e.executeCallback(callback, $button));

  /**
   * @method menuItem
   * @param index
   * @param text
   * @returns {Promise<*>}
   */
  this.menuItem = async (index, text) => {
    const $menu = await s.e2e.getElementBy('css', '.ant-dropdown:not(.ant-dropdown-hidden)');
    const $menuItems = await s.e2e.getElementsInsideOfBy(CLASS_NAMES.DROPDOWN_MENU_ITEM, $menu);
    let $item;
    if (typeof index === 'number') {
      expect($menuItems.length).toBeGreaterThanOrEqual(index);
      $item = $menuItems[index];
    }
    if (typeof text === 'string') {
      $item = await _filterByText($menuItems, text);
    }
    return await s.e2e.waitForClickable($item);
  };
};

module.exports = new Button();
