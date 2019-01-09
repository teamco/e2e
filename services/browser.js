/**
 * Created by tkachv on 5/15/2017.
 */

/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * Browser
 * @constructor
 */
const Browser = function() {

  /**
   * Maximize browser.
   * @property Browser
   */
  this.maximize = () => browser.driver.manage().window().maximize();

  /**
   * Set windows size.
   * @property Browser
   * @param {number} x
   * @param {number} y
   */
  this.setSize = (x, y) => browser.driver.manage().window().setSize(x, y);

  /**
   * Set browser position
   * @property Browser.setPosition
   * @param {number} x
   * @param {number} y
   * @returns {promise.Promise<void>}
   */
  this.setPosition = (x, y) => browser.driver.manage().window().setPosition(x, y);

  /**
   * deleteAllCookies
   * @property Browser
   */
  this.deleteAllCookies = () => browser.manage().deleteAllCookies();

  /**
   * ignoreSynchronization
   * @method ignoreSynchronization
   * @property Browser
   * @param {boolean} ignore
   */
  this.ignoreSynchronization = ignore => browser.ignoreSynchronization = ignore;

  /**
   * enableSynchronization
   * @method enableSynchronization
   * @property Browser
   */
  this.enableSynchronization = () => s.e2e.browser.ignoreSynchronization(false);

  /**
   * disableSynchronization
   * @method disableSynchronization
   * @property Browser
   */
  this.disableSynchronization = () => s.e2e.browser.ignoreSynchronization(true);

  /**
   * wait
   * @property Browser
   * @param {number} [timer]
   * @returns {*|!promise.Thenable.<void>|!webdriver.promise.Promise.<void>|promise.Promise<void>}
   */
  this.wait = timer => browser.sleep(timer || 3000);

  /**
   * getAction
   * @property Browser
   * @returns {!webdriver.ActionSequence|*|ActionSequence|!actions.ActionSequence}
   */
  this.getAction = () => browser.actions();

  /**
    * @method clickSimulation
    * @param $locator
    * @returns {Promise<void>}
    */
  this.clickSimulation = async $locator => {
    this.scrollToElement($locator);
    await s.e2e.waitForDisplayed($locator);
    this.mouseMove($locator);
    this.mouseDown($locator);
    this.mouseUp(true);
  };

  /**
   * doAction
   * @property Browser
   * @param {string} type
   * @param {*} [$locator]
   * @param {boolean} [perform]
   * @returns {promise.Promise<void>|promise.Thenable}
   */
  this.doAction = (type, $locator, perform) => {
    perform = typeof perform === 'undefined' ? true : perform;
    const action = this.getAction()[type]($locator);
    if (typeof $locator === 'number') {
      // In case of mouse click
      $locator = s.e2e.activeElement();
    }
    s.e2e.mouseTracker($locator, type);
    return perform ? action.perform() : action;
  };

  /**
   * refresh
   * @property Browser
   * @returns {promise.Promise<void>|promise.Thenable}
   */
  this.refresh = () => browser.refresh();

  /**
   * getTitle
   * @method getTitle
   * @property Browser
   * @param {string} url
   * @returns {promise.Promise<void>|promise.Thenable}
   */
  this.getTitle = url => browser.get(url).then(() => browser.getTitle());

  /**
   * validateTitle
   * @method validateTitle
   * @property Browser
   * @param {string} pathname
   * @param {string} titleName
   * @returns {promise.Promise<void>|promise.Thenable}
   */
  this.validateTitle = (pathname, titleName) => this.getTitle(pathname).then(title => expect(title).toEqual(titleName));

  /**
   * doubleClick
   * @property Browser
   * @param $locator
   * @returns {promise.Thenable}
   */
  this.doubleClick = $locator => this.doAction('doubleClick', $locator);

  /**
   * mouseClick
   * @property Browser
   * @param {string} mouseButtonType
   * @param {boolean} [perform]
   * @returns {promise.Promise<void>|promise.Thenable}
   */
  this.mouseClick = (mouseButtonType, perform) => {
    const click = protractor.Button;
    return this.doAction('click', click[mouseButtonType.toUpperCase()], perform);
  };

  /**
   * mouseMove
   * @property Browser
   * @param $locator
   * @param {*|boolean} [perform]
   * @returns {promise.Promise<void>|promise.Thenable}
   */
  this.mouseMove = ($locator, perform) => this.doAction('mouseMove', $locator, perform);

  /**
   * mouseMoveOffset
   * @property Browser
   * @method Browser.mouseMoveOffset
   * @param $locator
   * @param {{x: number, y: number}} opts
   * @param {boolean} [perform]
   * @returns {promise.Promise<void>|promise.Thenable}
   */
  this.mouseMoveOffset = ($locator, opts, perform) => {
    const action = this.getAction().mouseMove($locator, {x: opts.x, y: opts.y});
    return perform ? action.perform() : action;
  };

  /**
   * mouseDown
   * @property Browser
   * @param $locator
   * @param {boolean} [perform]
   * @returns {promise.Promise<void>|promise.Thenable}
   */
  this.mouseDown = ($locator, perform) => this.doAction('mouseDown', $locator, perform);

  /**
   * mouseUp
   * @property Browser
   * @param {boolean} [perform]
   * @returns {promise.Promise<void>|promise.Thenable}
   */
  this.mouseUp = perform => this.doAction('mouseUp', undefined, perform);

  /**
   * handleConfirmation
   * @method Browser.handleConfirmation
   * @property Browser
   * @param {boolean} confirm
   * @param {string} [text]
   */
  this.handleConfirmation = (confirm, text) => {
    s.e2e.waitForAlert().then(() => {
      const dialog = browser.switchTo().alert();
      expect(dialog.getText()).toMatch(text || 'Unsaved changes will be lost. Do you wish to continue?');
      confirm ? dialog.accept() : dialog.dismiss();
    });
  };

  /**
   * clickOnElement
   * @method Browser.clickOnElement
   * @property Browser
   * @param $locator
   * @param callback
   */
  this.clickOnElement = ($locator, callback) =>
    this.mouseMove($locator).then(() => this.mouseClick('left').then(() => s.e2e.executeCallback(callback)));

  /**
   * setEdtiorValue
   * @method Browser.setEdtiorValue
   * @property Browser
   * @param value
   */

  this.setEditorValue = value => browser.executeScript(`this.monaco.editor.getModels()[0].setValue("${value}")`);

  /**
   * getEditorMarkers
   * @method Browser.getEditorMarkers
   * @property Browser
   */

  this.getEditorMarkers = () => browser.executeScript(`return this.monaco.editor.getModelMarkers()`);

  /**
   * scrollToElement
   * @method Browser.scrollToElement
   * @property Browser
   * @param $locator
   * @returns {promise.Promise<void>}
   */
  this.scrollToElement = $locator => browser.executeScript('arguments[0].scrollIntoView();',
    $locator.getWebElement()).then(() => s.e2e.waitForDisplayed($locator));

  /**
   * scrollElement
   * @method Browser.scrollElement
   * @property Browser
   * @param $locator
   * @param {number} [scrollTo]
   * @returns {promise.Promise<void>}
   */
  this.scrollElement = ($locator, scrollTo) => browser.executeScript('arguments[0].scrollTop=arguments[1];',
    $locator.getWebElement(), scrollTo || 0);

  /**
   * canvasDragNDrop
   * @method Browser.canvasDragNDrop
   * @property Browser
   * @param $locator
   * @param {{[fromX]: number, [fromY]: number, [toX]: number, [toY]: number}} [opts]
   * @returns {promise.Promise<void>}
   */
  this.canvasDragNDrop = ($locator, opts) => {
    opts = opts || {};
    opts.fromX = opts.fromX || 100;
    opts.fromY = opts.fromY || 100;
    const x = opts.toX || 0;
    const y = opts.toY || 0;
    const action = this.mouseMoveOffset($locator, {
      x: opts.fromX,
      y: opts.fromY
    }).mouseDown().mouseMove({x: x, y: y}).mouseUp().perform();
    this.wait(500);
    return action;
  };

  /**
   * canvasDblClick
   * @method Browser.canvasDblClick
   * @property Browser
   * @param $locator
   * @param {{[fromX]: number, [fromY]: number}} [opts]
   * @returns {promise.Promise<void>}
   */
  this.canvasDblClick = ($locator, opts) => {
    opts = opts || {};
    opts.fromX = opts.fromX || 50;
    opts.fromY = opts.fromY || 50;
    s.e2e.cursorTracker({
      x: opts.fromX,
      y: opts.fromY,
      container: '.tab-content'
    });
    const dblClick = this.mouseMoveOffset($locator, {
      x: opts.fromX,
      y: opts.fromY
    }).doubleClick().perform();
    s.e2e.cursorTracker(false);
    return dblClick;
  };

  /**
   * elementScrollHeight
   * @method Browser.elementScrollHeight
   * @property Browser
   * @param $locator
   * @returns {promise.Promise<void>}
   */
  this.elementScrollHeight = $locator => browser.executeScript('return arguments[0].scrollTop;',
    $locator.getWebElement());

  /**
   * @method Browser.isFullScreen
   * @returns {*}
   */
  this.isFullScreen = () => {

    /**
     * @method _fullScreen
     * @returns {boolean}
     * @private
     */
    function _fullScreen() {
      const _is = ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'];
      let _fs = false;
      _is.forEach(fs => {
        if (document[fs]) {
          _fs = true;
        }
      });
      return _fs;
    }

    return browser.executeScript(_fullScreen);
  };

  /**
   * jQueryUIDragTo
   * @method Browser.jQueryUIDragTo
   * @property Browser
   * @param {promise.Promise<void>} $locator
   * @param {{x: number, y: number}} [opts]
   * @param {function} [callback]
   */
  this.jQueryUIDragTo = ($locator, opts, callback) => {
    opts = opts || {};
    opts.x = opts.x || 0;
    opts.y = opts.y || 0;
    $locator.then(() => s.e2e.browser.getAction().dragAndDrop($locator, opts).perform().then(() =>
      s.e2e.executeCallback(callback)));
  };

  /**
   * jQueryUIDropTo
   * @method Browser.jQueryUIDropTo
   * @property Browser
   * @param {promise.Promise<void>} $locator
   * @param {promise.Promise<void>} $drop
   * @param {function} [callback]
   */
  this.jQueryUIDropTo = ($locator, $drop, callback) =>
    $drop.then(() => $locator.then(() =>
      s.e2e.browser.getAction().dragAndDrop($locator,
        $drop).perform().then(() =>
        s.e2e.executeCallback(callback))));

  /**
   * dropHtml5To
   * @method Browser.dropHtml5To
   * @property Browser
   * @param {promise.Promise<void>} $locator
   * @param {promise.Promise<void>} $drop
   * @param {function} [callback]
   */
  this.dropHtml5To = ($locator, $drop, callback) =>
    browser.executeScript(require('html-dnd').code, $locator, $drop).then(() => s.e2e.executeCallback(callback));

  /**
   * @method Browser.handleMouseTracker
   * @property Browser
   * @param {string} x
   * @param {string} y
   * @param {string} [container]
   * @param {number} [wait]
   * @returns {promise.Promise<any>}
   */
  this.handleMouseTracker = (x, y, container, wait) => s.e2e.cursorTracker({
    x: x,
    y: y,
    container: container || 'body'
  }).then(() => {
    s.e2e.cursorTracker(false);
    this.wait(wait || 2000);
  });

  /**
   * You can use WebDriver remotely the same way you would use it locally.
   * @description https://seleniumhq.github.io/docs/remote.html
   */
  this.setFileDetector = () => {
    const remote = require('selenium-webdriver/remote');
    browser.driver.setFileDetector(new remote.FileDetector());
  };

  /**
   *
   * @param uploadMessage
   * @returns {Promise<void>}
   */
  this.getSuccsessMessage = async (uploadMessage) => {
    const $message = await s.e2e.getElementBy('css', 'div.ant-message-success', 'Displayed');
    expect($message.getText()).toEqual(uploadMessage);
  };

  /**
   *
   * @param uploadMessage
   * @returns {Promise<void>}
   */
  this.getErrorMessage = async (uploadMessage) => {
    const $message = await s.e2e.getElementBy('css', 'div.ant-message-error', 'Displayed');
    expect($message.getText()).toEqual(uploadMessage);
  };

  this.getNotificationMessage = async (uploadMessage) => {
    const $message = await s.e2e.getElementBy('css', 'div.ant-notification-notice-message', 'Displayed');
    expect($message.getText()).toEqual(uploadMessage);
  };

};

module.exports = new Browser();
