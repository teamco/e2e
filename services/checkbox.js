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
   * isSelected
   * @property Checkbox
   * @property Checkbox.isSelected
   * @param {WebElement} $locator   * @param $locator
   * @param $locator
   * @returns {!webdriver.promise.Promise.<void>|!promise.Thenable.<void>|!ActionSequence|promise.Promise<void>|ActionSequence|*}
   */
  this.isSelected = $locator => {
    return s.e2e.waitForPresence($locator).then(() => {
      return $locator.getAttribute('aria-checked').then(selected => {
        return selected === 'true';
      });
    });
  };

  /**
   * select
   * @property Checkbox
   * @property Checkbox.select
   * @param {WebElement} $checkbox
   * @param {boolean} select
   * @param {boolean} [validate]
   * @returns {!webdriver.promise.Promise.<void>|!promise.Thenable.<void>|!ActionSequence|promise.Promise<void>|ActionSequence|*}
   */
  this.select = function($checkbox, select, validate) {
    return $checkbox.getAttribute('aria-checked').then(checked => {
      const unCheck = checked === 'true' && !select;
      const check = checked === 'false' && select;
      if (check || unCheck) {
        const promise = s.e2e.browser.clickOnElement($checkbox, () => {
          if (validate) {
            promise.then(() => {
              expect($checkbox.getAttribute('aria-checked')).
              toEqual(select ? 'true' : 'false');
              return checked;
            });
          }
        });
        return promise;
      } else {
        expect(select).toBe(!select);
      }
    });
  };

  this.isChecked = async $checkbox => {
    // Verify checked is shown
    const $checkedElement = await s.e2e.getElementInsideOfBy('.ag-icon-checkbox-checked', $checkbox);
    return !await s.e2e.hasClassName($checkedElement, 'ag-hidden');
  };

  this.isUnChecked = async $checkbox => {
    // Verify Unchecked is shown
    const $uncheckedElement = await s.e2e.getElementInsideOfBy('.ag-icon-checkbox-unchecked', $checkbox);
    return !await s.e2e.hasClassName($uncheckedElement, 'ag-hidden');
  };

  this.toggle = async $checkbox => {
    // If checked
    const $checkedEl = await s.e2e.getElementInsideOfBy('.ag-icon-checkbox-checked', $checkbox);
    let hidden = await s.e2e.hasClassName($checkedEl, 'ag-hidden');
    if (!hidden) {
      return await s.e2e.button.press($checkedEl);
    }
    // If unchecked
    const $uncheckedEl = await s.e2e.getElementInsideOfBy('.ag-icon-checkbox-unchecked', $checkbox);
    hidden = await s.e2e.hasClassName($uncheckedEl, 'ag-hidden');
    if (!hidden) {
      return await s.e2e.button.press($uncheckedEl);
    }
    // If indeterminated
    const $indeterminateEl = await s.e2e.getElementInsideOfBy('.ag-icon-checkbox-indeterminate', $checkbox);
    hidden = await s.e2e.hasClassName($indeterminateEl, 'ag-hidden');
    if (!hidden) {
      return await s.e2e.button.press($indeterminateEl);
    }
  };
};

module.exports = new Checkbox();
