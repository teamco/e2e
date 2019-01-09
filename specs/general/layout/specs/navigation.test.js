describe('Navigation', () => {

  /**
   * Simplify services
   * @type {Services}
   */
  const s = require('./../../../../services/main.js').e2e;

  /**
   * @constant openTabAfterLogin
   * @type {string}
   */
  const openTabAfterLogin = 'Analytics';

  it('Check first time url after login: ' + openTabAfterLogin, () =>
    s.selectors.navBarMenuTabs().then($elements =>
      $elements.forEach($item =>
        s.hasClassName($item, 'selected').then(selected => {
          if (selected) {
            const textPromise = $item.getText();
            expect(textPromise).toEqual(openTabAfterLogin);
          }
        }))));

  it('Check breadcrumbs', () =>
    s.selectors.breadCrumbs().then($breadCrumbs =>
      expect(s.selectors.breadCrumbsLinks($breadCrumbs).get(0).getText()).toEqual(openTabAfterLogin)));
});
