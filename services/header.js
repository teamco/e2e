/**
 * Created by tkachv on 5/15/2017.
 */

/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * Header
 * @constructor
 */
const Header = function() {

  /**
   * @method Header.openNavMenu
   * @property Header
   * @param {function} [fn]
   */
  this.openNavMenu = fn => s.e2e.selectors.getUserMenu().then(
    async $user => {
      await s.e2e.browser.mouseMove($user, fn);
      await s.e2e.browser.mouseClick('left');
    });

  /**
   * closeRightMenu
   * @method closeRightMenu
   * @property Header
   */
  this.closeRightMenu = () => {
    // TODO (Tkachv): continue
  };

  /**
   * @method Header.logout
   * @property Header
   * @returns {Thenable<Thenable<T>>}
   */
  this.logout = async () => {
    await this.openNavMenu();
    const $logoutBtn = await s.e2e.selectors.logoutButton();
    await s.e2e.waitForDisplayed($logoutBtn);
    s.e2e.button.press($logoutBtn, () => s.e2e.selectors.loginButton());
  };

  /**
   * @method Header.tabPress
   * @property Header
   * @param {WebElement} $tab
   * @param {boolean} expanded
   * @returns {promise.Promise<R>|*}
   */
  this.tabPress = ($tab, expanded) => s.e2e.waitForGlobalLoader().then(() =>
    s.e2e.browser.clickOnElement($tab, () => $tab.getText().then(() =>
      s.e2e.getElementInsideOfBy('ul', $tab, 'Displayed').then(() =>
        s.e2e.shouldMatchToClassName($tab, 'ant-menu-submenu-open', expanded)))));

  /**
   * @method Header.tabTitle
   * @param $tab
   */
  this.tabTitle = ($tab) => s.e2e.getElementInsideOfBy('.ant-menu-submenu-title', $tab).then($title =>
    $title.getText());

  /**
   * @method Header.tabLogger
   * @param $tab
   * @param type
   */
  // eslint-disable-next-line no-console
  this.tabLogger = ($tab, type) => this.tabTitle($tab).then(text => console.log(type + ':', text));

  /**
   * @method Header.searchTabVerification
   * @param {string} title
   * @param {boolean} expected
   * @returns {*|Promise<R>}
   */
  this.searchTabVerification = (title, expected) => {
    const $input = s.e2e.selectors.searchTab();
    return s.e2e.input.updateValue($input, title).then(() =>
      s.e2e.selectors.searchResult().then($results => {
        expected ? expect($results.length > 0) : expect(!$results);
        $input.then($search => $search.getText().then(searchText =>
          $results.forEach($result => $result.getText().then(resultText =>
            expect(resultText.match(searchText))))));
        return $results;
      }));
  };

  /**
   * @method Header.locateTab
   * @param {string} title
   * @param {number} [index]
   */
  this.locateTab = (title, index) => {
    const that = this;

    /**
     * @method _validateTitle
     * @param $tab
     * @param {boolean} [isIndex]
     * @private
     */
    function _validateTitle($tab, isIndex) {
      $tab.getText().then(text => {
        const condition = isIndex ?
                          text.match(new RegExp(title, 'i')) :
                          text.toLowerCase() === title.toLowerCase();
        if (condition) {
          that.tabPress($tab, false);
          return true;
        }
      }).then(isPressed => expect(isPressed).toBeTruthy());
    }

    this.searchTabVerification(title, true).then(results => {
      expect(results.length).toBeGreaterThan(0);
      if (typeof index === 'number') {
        expect(index).not.toBeGreaterThan(results.length);
        const $tab = results[index];
        expect(typeof($tab)).not.toBe('undefined');
        _validateTitle($tab, true);
      } else {
        results.forEach($tab => _validateTitle);
      }
    });
  };

  /**
   * @method Header.cleanSearchFilter
   * @param $results
   */
  this.cleanSearchFilter = $results => s.e2e.selectors.cancelSearchFilter().then($clean =>
    s.e2e.browser.clickOnElement($clean).then(() =>
      s.e2e.selectors.searchResult().then($fullResults =>
        expect($fullResults.length > $results.length))));

  /**
   * @method Header.isVisibleNavigationMenu
   * @param {boolean} visible
   */
  this.isVisibleNavigationMenu = visible =>
    s.e2e.selectors.antMenu().then($antMenu => {
      s.e2e.getClassNames($antMenu).then(classes => {
        const matcher = classes.indexOf('ant-menu-inline-collapsed');
        (visible ?
         expect(matcher === -1) :
         expect(matcher > -1)).toBeTruthy();
      });
      return $antMenu;
    });
};

module.exports = new Header();
