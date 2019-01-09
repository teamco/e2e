/**
 * aia-ui-frontend
 * @name navigation
 * @author alexache
 * @date 3/25/2018
 * @time 1:21 PM
 */
/**
 * @constant
 * @type {Services}
 */
const s = require('./main.js');

/**
 * @method Navigation
 * @constructor
 */
const Navigation = function() {
  /**
   * @method Navigation.findMenuGroupByText
   * @property Navigation
   * @param {string} groupName
   * @returns {ElementFinder}
   */
  this.findMenuGroupByText = async groupName => {
    const $list = await s.e2e.selectors.navBarMenuTabs();
    for (let $item of $list) {
      const text = await $item.getText();
      // In case of open group - there could be several items.
      // We need only first one.
      const firstMenu = text.split(/\n/)[0];
      if (firstMenu === groupName) {
        return $item;
      }
    }
  };

  /**
   * @method Navigation.findMenuItemByPath
   * @property Navigation
   * @param {ElementFinder} $group
   * @param {string} path
   * @returns {ElementFinder}
   */
  this.findMenuItemByPath = async ($group, path) => {
    const $item = await s.e2e.selectors.navBarMenuTabItem($group, path);
    expect($item.getAttribute('href')).toMatch(path);
    return $item;
  };

  /**
   * @method Navigation.validateNavigationPath
   * @property Navigation
   * @param {ElementFinder} $group
   * @param {string} path
   * @returns {Promise<void>}
   */
  this.validateNavigationPath = async ($group, path) => {
    const $item = await this.findMenuItemByPath($group, path);
    const $breadCrumbs = await s.e2e.selectors.breadCrumbs();
    const $links = await s.e2e.selectors.breadCrumbsLinks($breadCrumbs);
    expect($links[$links.length - 1].getText()).toEqual($item.getText());
  };

  /**
   * @method navigateValidator
   * @property Navigation
   * @param {string} [parentMenuName] - Can be defined in context.
   * @param {string} [path] - Can be defined in context.
   */
  this.navigateValidator = (parentMenuName, path) => {
    it('Should validate navigation path: ' + path, async () => {
      parentMenuName = parentMenuName || (c && c.parentMenuName);
      path = path || (c && c.path);

      const $group = await this.findMenuGroupByText(parentMenuName);
      expect($group).toBeDefined();

      /**
       * @constant expanded
       * @type {boolean}
       */
      const expanded = (await $group.getAttribute('aria-expanded')) === 'true';

      if (!expanded) {
        await s.e2e.button.press($group);
      }
      const $item = await this.findMenuItemByPath($group, path);
      expect($item).toBeDefined();

      await s.e2e.button.press($item);

      await this.validateNavigationPath($group, path);
    });
  };

  /**
   * @method showDataOnDblClick
   * @property Navigation
   */
  this.showDataOnDblClick = () => {
    it('Should show item data on click', async () => {
      const $cell = await s.e2e.grid.getDataRow(0, 'Name');
      const name = await $cell.getText();
      await s.e2e.browser.doubleClick($cell);
      const $page = await s.e2e.selectors.pageContainer();
      const $input = await s.e2e.selectors.inputName($page);
      const value = await $input.getAttribute('value');

      expect(value).toEqual(name);
    });
  };

  this.showDataOnRowDblClick = (cellName) => {
    it('Should show item data on click', async () => {
      const $cell = await s.e2e.grid.getDataRow(0, 'Name');
      const $cellForClick = await s.e2e.grid.getDataRow(0, cellName);
      const name = await $cell.getText();
      await s.e2e.browser.doubleClick($cellForClick);
      const $page = await s.e2e.selectors.pageContainer();
      const $input = await s.e2e.selectors.inputName($page);
      const value = await $input.getAttribute('value');

      expect(value).toEqual(name);
    });
  };

};

module.exports = new Navigation();
