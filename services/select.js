/**
 * Created by yurygo on 6/10/2018.
 */

const
  SELECT = '.ant-select',
  SELECT_VALUE = '.ant-select-selection-selected-value',
  SELECT_OPEN_CLS = 'ant-select-open',
  SELECT_ENABLED_CLS = 'ant-select-enabled',
  SELECT_DROPDOWN = '.ant-select-dropdown',
  SELECT_OPTION = '.ant-select-dropdown-menu-item',
  SELECT_DISABLED_OPTION_CLS = 'ant-select-dropdown-menu-item-disabled',
  SELECT_DISABLED_OPTION = `.${SELECT_DISABLED_OPTION_CLS}`,
  SELECT_SELECTED_OPTION_CLS = 'ant-select-dropdown-menu-item-selected',
  SELECT_SELECTED_OPTION = `.${SELECT_SELECTED_OPTION_CLS}`,
  SELECT_ACTIVE_OPTION = `${SELECT_OPTION}:not(${SELECT_DISABLED_OPTION})`,
  SELECT_SELECTABLE_OPTION = `${SELECT_ACTIVE_OPTION}:not(${SELECT_SELECTED_OPTION})`;

/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * Select
 * @constructor
 */
const Select = function() {

  /**
   * getSelect
   * @method Select.getSelect
   * @property Select
   * @param {string} customSelector - custom select class with dot (e.g. "._t_MySelect")
   * @param {string} [type]
   */
  this.getSelect = async (customSelector, type) => s.e2e.getElementBy('css', `${customSelector.trim()}${SELECT}`, type);

  /**
   * getDropdown
   * @method Select.getDropdown
   * @property Select
   * @param {string} customDropdownSelector - custom dropdown class with dot (e.g. "._t_MySelect")
   * @param {string} [type]
   */
  this.getDropdown = async (customDropdownSelector, type) =>
    s.e2e.getElementBy('css', `${customDropdownSelector.trim()}${SELECT_DROPDOWN}`, type);

  /**
   * isEnabled
   * @method Select.isEnabled
   * @property Select
   * @param {WebElement} $locator
   */
  this.isEnabled = async ($locator) => s.e2e.hasClassName($locator, SELECT_ENABLED_CLS);

  /**
   * verifyEnabled
   * @method Select.verifyEnabled
   * @property Select
   * @param {WebElement} $locator
   * @param {boolean} enabled
   */
  this.verifyEnabled = async function($locator, enabled = true) {
    // expect(await this.isEnabled($locator)).toBe(enabled);
    s.e2e.waitForClass($locator, SELECT_ENABLED_CLS, {present: enabled});
  };

  /**
   * isOpen
   * @method Select.isOpen
   * @property Select
   * @param {WebElement} $locator
   */
  this.isOpen = async ($locator) => s.e2e.hasClassName($locator, SELECT_OPEN_CLS);

  /**
   * verifyOpen
   * @method Select.verifyOpen
   * @property Select
   * @param {WebElement} $locator
   * @param {boolean} [open]
   */
  this.verifyOpen = async ($locator, open = true) => {
    // expect(await this.isOpen($locator)).toBe(open);
    s.e2e.waitForClass($locator, SELECT_OPEN_CLS, {present: open});
  };

  /**
   * @method Select.toggleOpen
   * @property Select
   * @param {ElementFinder} $locator
   * @param {Boolean} open
   * @returns {Promise<void>}
   */
  this.toggleOpen = async ($locator, open = true) => {
    const isOpen = await this.isOpen($locator);
    if (!!isOpen === !!open) {
      // Select is already has correct state
      return;
    }

    await s.e2e.button.press($locator);

    await this.verifyOpen($locator, open);
  };

  /**
   * hasOptions
   * @method Select.hasOptions
   * @property Select
   * @param {WebElement} $dropdown
   */
  this.hasOptions = async ($dropdown) => {
    const $options = await this.getOptions($dropdown);
    if ($options > 1) return true;
    return !await s.e2e.hasClassName($options[0], SELECT_DISABLED_OPTION_CLS);
  };

  /**
   * verifyOptions
   * @method Select.verifyOptions
   * @property Select
   * @param {WebElement} $dropdown
   * @param {boolean} [has]
   */
  this.verifyHasOptions = async ($dropdown, has = true) => {
    expect(await this.hasOptions($dropdown)).toBe(has);
  };

  /**
   * get all Options
   * @method Select.getOptions
   * @property Select
   * @param {WebElement} $dropdown
   */
  this.getOptions = async ($dropdown) => s.e2e.getElementsInsideOfBy(SELECT_OPTION, $dropdown);

  /**
   * get Active Options (enabled)
   * @method Select.getActiveOptions
   * @property Select
   * @param {WebElement} $dropdown
   */
  this.getActiveOptions = async ($dropdown) => s.e2e.getElementsInsideOfBy(SELECT_ACTIVE_OPTION, $dropdown);

  /**
   * get Selectable Options (enabled and not selected)
   * @method Select.getSelectableOptions
   * @property Select
   * @param {WebElement} $dropdown
   */
  this.getSelectableOptions = async ($dropdown) => s.e2e.getElementsInsideOfBy(SELECT_SELECTABLE_OPTION, $dropdown);

  /**
   * get first Selectable Option (enabled and not selected)
   * @method Select.getSelectableOption
   * @property Select
   * @param {WebElement} $dropdown
   * @param {string} [type]
   */
  this.getSelectableOption =
    async ($dropdown, type) => s.e2e.getElementInsideOfBy(SELECT_SELECTABLE_OPTION, $dropdown, type);

  const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
  const escStrRegExp = _ => _.replace(matchOperatorsRe, '\\$&');

  /**
   * get first Option contains text
   * @method Select.getOptionByContent
   * @property Select
   * @param {WebElement} $dropdown
   * @param {string} content
   * @param {boolean} [exact]
   * @param {string} [type]
   */
  this.getOptionByContent = async ($dropdown, content, exact, type) => {
    const search = exact ? new RegExp(`^${escStrRegExp(content)}$`) : content;
    return s.e2e.getElementByTextInsideOf(SELECT_OPTION, search, $dropdown, type);
  };

  /**
   * get value
   * @method Select.getValue
   * @property Select
   * @param {WebElement} $locator
   * @param {string} [type]
   */
  this.getValue = async ($locator, type) => {

    // const $container = await s.e2e.getElementInsideOfBy(SELECT_VALUE, $locator, type);
    // if (!$container) return undefined;
    // return $container.getText();

    const $containers = await s.e2e.getElementsInsideOfBy(SELECT_VALUE, $locator);
    if (!$containers.length) return undefined;
    s.e2e.highlightElement($containers[0]);
    return $containers[0].getText();
  };

  /**
   * wait for value
   * @method Select.waitForValue
   * @property Select
   * @param $locator
   * @param text
   * @param timeout
   * @returns {Promise<void>}
   */
  this.waitForValue = async ($locator, text, timeout) => {
    const $container = await s.e2e.getElementInsideOfBy(SELECT_VALUE, $locator);
    await s.e2e.waitForText($container, s.e2e.getTextDetector(text), timeout);
  };

  /**
   * selectOption
   * @method Select.selectOption
   * @property Select
   * @param {WebElement} $option - option to be selected
   * @param {WebElement} $locator - select
   */
  this.selectOption = async ($option, $locator) => {
    const isOpen = await this.isOpen($locator);
    expect(isOpen).toBe(true);

    const optionText = await $option.getText();
    expect(!!optionText).toBe(true);
    await s.e2e.browser.scrollToElement($option);
    await s.e2e.button.press($option);

    await this.waitForValue($locator, optionText);
    return optionText;
  };

};

module.exports = new Select();
