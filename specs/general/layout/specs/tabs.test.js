// Get services
describe('Tabs', () => {

  /**
   * Simplify services
   * @type {Services}
   */
  const s = require('./../../../../services/main.js').e2e;

  it('Available', () => s.selectors.navBarMenuTabs().then($elements => expect($elements.length > 0)));

  /*it('Functionality: expand/show/load content', () => s.selectors.navBarMenuTabs().then($elements =>
    $elements.forEach($tab => s.hasClassName($tab, 'ant-menu-submenu-open').then(expanded => {
      if (expanded) {
        s.header.tabLogger($tab, 'Current');
      } else {
        $tab.isDisplayed().then(displayed => {
          s.header.tabPress($tab, displayed);
          s.header.tabLogger($tab, displayed ? 'Expand' : 'Open');
        });
      }
    })))
  );*/

  it('Manual toggle navigation tabs', () => {
    const toggleButton = s.selectors.toggleNavBar();
    toggleButton.then($hide => $hide.click().then(() => {
      s.header.isVisibleNavigationMenu(false);
      toggleButton.then($show => $show.click().then(() => s.header.isVisibleNavigationMenu(true)));
    }));
  });

  it('Browser resize affect toggle navigation tabs', () => s.browser.setSize(600, 600).then(() => {
    s.activeElement().then(() => s.selectors.antMenuPopOverButton().then($antMenu => s.button.press($antMenu)));
    s.browser.setSize(1300, 600).then(() => s.activeElement().then(() => s.header.isVisibleNavigationMenu(true)));
  }));
});
