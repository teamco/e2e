/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * @constant
 * @type {{new: string, publish: string, sync: string, delete: string}}
 */
const branchActions = {
  new: '_t_NewBusinessRequest',
  publish: '_t_PublishBranch',
  sync: '_t_SyncBranch',
  delete: '_t_DeleteWorkspace'
};

/**
 * Branch
 * @constructor
 */
const Branch = function() {

  /**
   * @method handleBranch
   * @param {string} action
   * @param {function} [fn]
   * @returns {Promise<void>}
   */
  this.handleBranch = async (action, fn) => {

    /**
     * @method _click
     * @param $locator
     * @returns {Promise<void>}
     * @private
     */
    async function _click($locator) {
      await s.e2e.waitForClickable($locator);
      await s.e2e.browser.mouseMove($locator);
      await s.e2e.browser.mouseClick('left');
    }

    /**
     * @method _$branch
     * @private
     * @returns {*}
     */
    async function _$branch() {
      let $branch = element(by.css('span._t_branch'));
      const present = await $branch.isPresent();
      if (!present) {
        $branch = element(by.css('div._t_BranchMenuIcon > span'));
      }
      return await s.e2e.waitForDisplayed($branch);
    }

    /**
     * @method _$branchAction
     * @param {string} action
     * @returns {*}
     * @private
     */
    async function _$branchAction(action) {
      const $container = await s.e2e.getElementBy('css', 'div[class*=buttonContainer]');
      return s.e2e.getElementInsideOfBy(`button.${branchActions[action]}`, $container);
    }

    /**
     * @method _openMenu
     * @returns {Promise<void>}
     * @private
     */
    async function _openMenu() {
      const $branch = await _$branch();
      const $menu = element(by.css('._t_Drawer'));
      const present = await $menu.isPresent();
      if (!present) {
        await _click($branch);
      }
      await s.e2e.waitForDisplayed($menu);
    }

    /**
     * @method _menuClick
     * @param {string} action
     * @returns {string|boolean}
     * @private
     */
    async function _menuClick(action) {
      const $action = await _$branchAction(action);
      return $action.getAttribute('disabled').then(async disabled => {
        if (typeof disabled === 'string') {
          console.log('Skip disabled action', await $action.getText());
          return false;
        }
        await _click(await _$branchAction(action));
        return action;
      });
    }

    /**
     * @method _waitForLoaders
     * @returns {Promise<void>}
     * @private
     */
    async function _waitForLoaders() {
      await s.e2e.waitForGlobalLoader();
      await s.e2e.waitForLocalLoader();
      await s.e2e.browser.wait();
    }

    /**
     * @method _createNewBR
     * @param {string} action
     * @returns {Promise<void>}
     * @private
     */
    async function _createNewBR(action) {
      // In case of BR already created
      if (!action) {
        return false;
      }
      const $input = s.e2e.getElementBy('css', 'input._t_branchName');
      const $create = await s.e2e.getElementBy('css', 'button._t_create');
      await s.e2e.input.updateValue($input, `BR_${(+(new Date()))}`);
      await s.e2e.button.press($create);
    }

    /**
     * @method _closeBRMenu
     * @returns {Promise<void>}
     * @private
     */
    async function _closeBRMenu() {
     // const $close = await s.e2e.getElementBy('css', 'i._t_closeDrawerIcon');
     // await s.e2e.button.press($close);
      const $header = await s.e2e.getElementBy('css','.ant-layout-header');
      await s.e2e.browser.mouseMove($header);
      await s.e2e.browser.mouseClick('left');


    }

    switch (action) {
      case 'later':
        const $later = element(by.cssContainingText('button', 'Later'));
        const present = await $later.isPresent();
        if (present) {
          await s.e2e.button.press(await $later);
        }
        await _waitForLoaders();
        break;
      case 'sync':
        break;
      case 'new':
        await _waitForLoaders();
        await _openMenu();
        await _createNewBR(await _menuClick('new'));
        await _closeBRMenu();
        await s.e2e.waitForGlobalLoader();
        break;
      case 'delete':
        await _waitForLoaders();
        await _openMenu();
        await _menuClick('delete', async () =>
          await s.e2e.button.press(await s.e2e.getElementByText('div.ant-confirm-body-wrapper button', 'Yes')));
        break;
      default:
        break;
    }

    if (typeof fn === 'function') {
      fn();
    }
  };
};

module.exports = new Branch();
