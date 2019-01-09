/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * Selectors
 * @constructor
 */
const Selectors = function() {

  /**
   * getComputedStyle
   * @property Selectors
   * @param $locator
   * @param property
   * @returns {*|!promise.Thenable.<T>|!promise.Promise.<T>|promise.Promise<T>}
   */
  this.getComputedStyle = ($locator, property) => {
    let script = 'window.getComputedStyle(arguments[0])';
    script += (property ? '.getPropertyValue("' + property + '");' : ';');
    return browser.executeScript(script, $locator.getWebElement());
  };

  /**
   * getCssValue
   * @property Selectors
   * @param $locator
   * @param cssKey
   * @returns {!promise.Thenable.<string>|!webdriver.promise.Promise.<string>|promise.Promise<string>}
   */
  this.getCssValue = ($locator, cssKey) => $locator.getCssValue(cssKey);

  /**
   * @method Selectors.mainLayout
   * @property Selectors
   */
  this.mainLayout = () => s.e2e.waitForDisplayed(s.e2e.getElementsBy('css', '.ant-layout').get(0));

  /**
   * @method Selectors.mainNavBar
   * @property Selectors
   */
  this.mainNavBar = () => s.e2e.getElementBy('css', '.ant-layout-sider');

  /**
   * @method Selectors.antMenu
   * @property Selectors
   */
  this.antMenu = () => s.e2e.getElementBy('css', 'div[class*="__siderContent__"] > ul');

  /**
   * @method Selectors.antMenuPopOver
   * @property Selectors
   */
  this.antMenuPopOverButton = () => s.e2e.getElementBy('css', 'div[class*="__leftWrapper__"] [class*="__button__"]');

  /**
   * @method Selectors.antMenuPopOver
   * @property Selectors
   */
  this.antMenuPopOverMenu = () => s.e2e.getElementBy('css', 'div[class^="ant-popover-placement-bottomLeft"]');

  /**
   * @method Selectors.toggleNavBar
   * @property Selectors
   * @returns {*}
   */
  this.toggleNavBar = () => s.e2e.getElementBy('css', '.ant-layout-sider-trigger', 'Clickable');

  /**
   * canvas
   * @method Selectors.canvas
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.canvas = () => s.e2e.getElementBy('css', 'canvas');

  /**
   * mainCanvas
   * @method Selectors.mainCanvas
   * @property Selectors
   * @param {string} [type]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.mainCanvas = type => s.e2e.getElementBy('css', 'canvas', type);

  /**
   * menuCanvas
   * @method Selectors.menuCanvas
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.menuCanvas = () => s.e2e.getElementBy('css', '.ext_wrapper .flap');

  /**
   * menuCanvasContent
   * @method Selectors.menuCanvasContent
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.menuCanvasContent = () => s.e2e.getElementBy('css', '.extruder-content');

  /**
   * menuCanvasItems
   * @method Selectors.menuCanvasItems
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.menuCanvasItems = () => s.e2e.getElementsBy('css', '.ext_wrapper li.draggable');

  /**
   * canvasDropZone
   * @method Selectors.canvasDropZone
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.canvasDropZone = () => s.e2e.getElementBy('css', '.dropzone');

  /**
   * getUserMenu
   * @method Selectors.getUserMenu
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.getUserMenu = () => s.e2e.getElementBy('css', '.ant-menu-submenu .anticon-user');

  /**
   * userName
   * @method Selectors.userName
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.userName = () => s.e2e.getElementBy('id', 'username');

  /**
   * userPassword
   * @method Selectors.userPassword
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.userPassword = () => s.e2e.getElementBy('id', 'password');

  /**
   * logoutButton
   * @method Selectors.logoutButton
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.logoutButton = () => s.e2e.getElementByText('.ant-menu-item', 'Sign out', 'Clickable');

  /**
   * loginButton
   * @method Selectors.loginButton
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.loginButton = () => s.e2e.getElementByText('button', 'Sign in', 'Clickable');

  /**
   * loginFailed
   * @method Selectors.loginFailed
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.loginFailed = () => s.e2e.getElementBy('css', '.ant-message-error');

  /**
   * globalLoader
   * @method Selectors.globalLoader
   * @property Selectors.globalLoader
   * @param {boolean} visible
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.globalLoader = visible => {
    const hidden = '[class*="hidden"]';
    const cssLoader = 'div[class*="__loader__"][class*="fullScreen"]';
    const css = cssLoader + (visible ? '' : hidden);
    return s.e2e.getElementBy('css', css);
  };

  /**
   * localLoader
   * @method Selectors.localLoader
   * @property Selectors
   * @param {boolean} visible
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.localLoader = visible => {
    const hidden = '[class*="hidden"]';
    const cssLoader = 'div[class*="__loader__"]:not([class*=fullScreen])';
    const css = cssLoader + (visible ? '' : hidden);
    return s.e2e.getElementBy('css', css);
  };

  /**
   * navBarMenuTabs
   * @method Selectors.navBarMenuTabs
   * @property Selectors
   * @returns {ElementArrayFinder}
   */
  this.navBarMenuTabs = () => s.e2e.getElementBy('css', '.ant-layout-sider-children').then($nav =>
    s.e2e.getElementsInsideOfBy('li', $nav));

  /**
   * @method Selectors.navBarMenuTabItem
   * @property Selectors
   * @param {ElementFinder} $locator
   * @param {string} path
   * @returns {*}
   */
  this.navBarMenuTabItem = ($locator, path) =>
    s.e2e.getElementInsideOfBy('.ant-menu-item a[href="/' + path + '"]', $locator);

  /**
   * breadCrumbs
   * @method Selectors.breadCrumbs
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.breadCrumbs = () => s.e2e.getElementBy('css', '.ant-breadcrumb');

  /**
   * breadCrumbsLinks
   * @method Selectors.breadCrumbsLinks
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.breadCrumbsLinks = $breadCrumbs => s.e2e.getElementsInsideOfBy('.ant-breadcrumb-link', $breadCrumbs);

  /**
   * @method Selectors.searchTab
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.searchTab = () => s.e2e.getElementBy('css', 'md-input-container input[ng-model="menuOptions.search"]');

  this.cancelSearchFilter = () => s.e2e.getElementBy('css', 'button[ng-click="menuOptions.search=\'\'"');

  /**
   * @method Selectors.searchResult
   * @property Selectors
   * @returns {ElementArrayFinder}
   */
  this.searchResult = () => s.e2e.getElementsBy('css',
    'div[ng-repeat="item in collection track by $index"].leaf:not(.ng-hide)');

  /**
   * modalOkButton
   * @method Selectors.modalOkButton
   * @property Selectors
   * @param {WebElement} $modal
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.modalOkButton = $modal =>
    s.e2e.getElementInsideOfBy('.modal-footer button[ng-click="click($event, btn)"]', $modal);

  /**
   * modalBody
   * @method Selectors.modalBody
   * @property Selectors
   * @param {WebElement} $modal
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.modalBody = $modal => s.e2e.getElementInsideOfBy('.modal-body', $modal);

  /**
   * modalDialog
   * @method Selectors.modalDialog
   * @property Selectors
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.modalDialog = () => s.e2e.getElementBy('css', '.modal-dialog');

  /**
   * filter
   * @property Selectors
   * @method Selectors.filter
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.filter = () => s.e2e.getElementBy('model', 'searchString');

  /**
   * filterButton
   * @property Selectors
   * @method Selectors.filterButton
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.filterButton = () => s.e2e.getElementBy('css',
    '[ng-click="search($event)"]');

  /**
   * @property Selectors
   * @method Selectors.pageContainer
   * @returns {promise.Promise<any>|WebElement}
   */
  this.pageContainer = () => s.e2e.waitForLocalLoader().then(() =>
    s.e2e.getElementBy('id', 'pageContainer', 'Displayed'));

  /**
   * @property Selectors
   * @method Selectors.pageContainer
   * @param {WebElement} $page
   * @returns {promise.Promise<any>|ElementFinder}
   */
  this.inputName = $page => s.e2e.getElementInsideOfBy('input#name', $page);

  /**
   * @property Selectors
   * @method Selectors.getCard
   * @returns {*}
   */
  this.getCard = () => s.e2e.getElementsBy('css', '.ant-layout').get(0);//s.e2e.getElementBy('css', '.ant-card');

  /**
   * @property Selectors
   * @method Selectors.getCardTag
   * @param {ElementFinder} $card
   * @returns {*}
   */
  this.getCardTag = $card => s.e2e.getElementInsideOfBy('.ant-card-body > div .ant-tag', $card);

  /**
   * @property Selectors
   * @method Selectors.getTooltip
   * @returns {*}
   */
  this.getTooltip = () => s.e2e.getElementBy('css', '.ant-tooltip-content:not(.ant-tooltip-hidden)', 'Displayed');

  /**
   *
   * @returns {ElementArrayFinder}
   */
  this.getCards = () => s.e2e.getElementsBy('css', '.ant-card');

  /**
   *
   * @returns {ElementArrayFinder}
   */
  this.getActiveDropDown = () => s.e2e.getElementBy('css', '.ant-select-dropdown:not(.ant-select-dropdown-hidden)');

  /**
   * @property Selector
   * @param {string} text
   * @returns {Promise<*>}
   */
  this.getComboBox = async text => {
    const $label = await s.e2e.getElementByText('label', text);
    const $locator = await s.e2e.getSibling(await s.e2e.getParentElement($label), 'div');
    return await s.e2e.getElementInsideOfBy('.ant-select-selection__rendered', $locator);
  };

};

module.exports = new Selectors();
