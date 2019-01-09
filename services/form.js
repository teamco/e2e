/**
 * Created by tkachv on 5/15/2017.
 */

/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * Form
 * @constructor
 */
const Form = function() {

  /**
   * updateDetails
   * @method Form.updateDetails
   * @property Form
   * @param {string} css
   * @param {string} value
   * @param {number} countBefore
   * @param {string} action [Create|Update]
   * @param {function} [callback]
   */
  this.updateDetails = (css, value, countBefore, action, callback) => {
    const $id = s.e2e.getElementBy('css', css);
    s.e2e.input.updateValue($id, value).then(() => {
      s.e2e.activityBar['saveNClose' + action + 'Press'](() => {
        s.e2e.grid.numberOfItems().then(countAfter => {
          const matcher = countAfter.match(/\d+/);
          countAfter = matcher ? parseInt(matcher[0], 10) : 0;
          if (countBefore === countAfter) {
            // TODO (Tkachv): Handle duplicates
          } else {
            expect(countAfter).toBeGreaterThan(countBefore);
            s.e2e.executeCallback(callback);
          }
        });
      });
    });
  };

  /**
   * createNewItem
   * @method Form.createNewItem
   * @property Form
   * @param {function} [before]
   * @param {string} testName
   * @param {string} fieldCss
   * @param {string} [value]
   */
  this.createNewItem = (before, testName, fieldCss, value) =>
      it(testName, () => s.e2e.grid.numberOfItems().then(countBefore => {
        let matcher = countBefore.match(/\d+/);
        countBefore = matcher ? parseInt(matcher[0], 10) : 0;
        s.e2e.activityBar.buildNewItem(() => {
          value = value || 'Name: ' + (+new Date());
          if (typeof before === 'function') {
            before(() => this.updateDetails(fieldCss, value, countBefore, 'Create'));
          }
        });
      }));

  /**
   * handleLeftMenu
   * @method Form.handleLeftMenu
   * @property Form
   * @param {number} index
   * @param {function} [callback]
   */
  this.handleLeftMenu = (index, callback) =>
      s.e2e.activityBar.getLeftMenuItems().then($list => {
        const $a = $list[index];
        s.e2e.waitForClickable($a).then(() =>
            s.e2e.browser.clickOnElement($a, () =>
                s.e2e.executeCallback(callback)));
      });
};

module.exports = new Form();