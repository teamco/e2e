/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * ActivityBar
 * @constructor
 */
const ActivityBar = function() {

  /**
   * @method ActivityBar.titleValidator
   * @property ActivityBar
   * @param {string} title
   */
  this.titleValidator = title => it('ActivityBar Title: ' + title, () => this.validateBarTitle(title));

  /**
   * @method ActivityBar.validateBarTitle
   * @property ActivityBar
   * @param {string} title
   */
  this.validateBarTitle = title =>
      s.e2e.selectors.pontisActivityBar().then($bar =>
          $bar.getAttribute('title').then(text =>
              expect(title.toLowerCase().trim()).toEqual(text.toLowerCase().trim())));

  /**
   * getButton
   * @method ActivityBar.getButton
   * @property ActivityBar
   * @param {string} button
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.getButton = button => s.e2e.getElementBy('css', button);

  /**
   * buttonCallback
   * @method ActivityBar.buttonCallback
   * @property ActivityBar
   * @param {string} css
   * @param {function} callback
   */
  this.buttonCallback = (css, callback) => this.getButton(css).then($button =>
      s.e2e.executeCallback(callback, $button));

  const availableButtons = [
    'new', 'saveCreate', 'saveUpdate', 'createCopy',
    'saveNCloseCreate', 'saveNCloseUpdate', 'close'
  ];

  // IDE helper
  this.newPress = this.createCopyPress = this.saveCreatePress = this.saveUpdatePress =
      this.saveNCloseCreatePress = this.saveNCloseUpdatePress =
          this.closePress = undefined;

  availableButtons.forEach(button => {

    /**
     * buttonPress
     * @method ActivityBar[newPress|savePress|saveNClosePress|closePress]
     * @property ActivityBar
     * @param {function} [callback]
     * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
     */
    this[button + 'Press'] = callback =>
        this.buttonCallback(s.e2e.selectors[button], $button =>
            s.e2e.button.press($button, () =>
                s.e2e.executeCallback(callback, $button)));
  });

  /**
   * Handle close confirmation
   * @method ActivityBar.closeConfirmation
   * @property ActivityBar
   */
  this.closeConfirmation = () => this.closePress(() => {
    s.e2e.browser.handleConfirmation(false);
    this.closePress(() => s.e2e.browser.handleConfirmation(true));
  });

  /**
   * openMoreXML
   * @method ActivityBar.openMoreXML
   * @property ActivityBar
   * @param {function} [callback]
   */
  this.openMoreXML = callback => this.newPress(() =>
      this.buttonCallback(s.e2e.selectors.more, $button => {
        const $xml = s.e2e.button.getMenuButtonItem($button, 0);
        $xml.then($locator => s.e2e.browser.clickOnElement($locator, () => {
          this.validateBarTitle('Composite');
          s.e2e.executeCallback(callback);
        }));
      }));

  /**
   * inactiveButtons
   * @method ActivityBar.inactiveButtons
   * @property ActivityBar
   * @param {boolean} inactive
   * @param {string} [save]
   * @param {string} [saveNClose]
   */
  this.inactiveButtons = (inactive, save, saveNClose) => {
    this.buttonCallback(save, $button => s.e2e.button.isDisabled($button, inactive));
    this.buttonCallback(saveNClose, $button => s.e2e.button.isDisabled($button, inactive));
  };

  /**
   * validateStatusBar
   * @method ActivityBar.validateStatusBar
   * @property ActivityBar
   */
  this.validateStatusBar = () => {
    s.e2e.selectors.pontisStatusBarItem().then($statusBar => {
      $statusBar.getAttribute('statusbarjson').then(json => {

        /**
         * json
         * @type {{Statuses: {Status: {Title, PossibleStatuses: {PossibleStatus: []}}}}}
         */
        json = JSON.parse(s.e2e.fixJSON(json)).Statuses.Status;
        const $list = s.e2e.getElementsBy('css', 'li', $statusBar);
        $list.each(($li, index) => {
          s.e2e.waitForPresence($li).then(() => {
            const expectedText = json[index].Title;

            /**
             * status
             * @type {{showText, Title}}
             */
            const status = json[index].PossibleStatuses.PossibleStatus[0];
            const statusText = status.showText === 'true' ? status.Title : '';
            s.e2e.validateText($li, expectedText + ' ' + statusText);
          });
        });
      });
    });
  };

  /**
   * @method ActivityBar.getLeftMenuItems
   * @property ActivityBar
   * @returns {*|promise.Promise<R>}
   */
  this.getLeftMenuItems = () =>
      s.e2e.selectors.visualRulesFileFormProfTabProf().then($control =>
          s.e2e.getElementInsideOfBy('.list-group', $control).then(
              $menu => s.e2e.getElementsBy('css', 'a', $menu)));

  /**
   * @method ActivityBar.buildNewItem
   * @param {function} [callback]
   * @param {number} [index]
   */
  this.buildNewItem = (callback, index) => this.newPress($button =>
      $button.getAttribute('ng-click').then(eventName => {
        if (eventName === '$mdMenu.open($event)') {
          if (typeof index === 'undefined') {
            index = 0;
          }
          $button.getAttribute('aria-owns').then(id => s.e2e.getElementBy('id', id).then($menu => {
            const items = s.e2e.getElementsInsideOfBy('md-menu-item', $menu);
            items.count().then(count => expect(index).not.toBeGreaterThan(count - 1));
            return s.e2e.waitForClickable(items.get(index)).then($item => $item.click().then(() =>
                s.e2e.executeCallback(callback)));
          }));
        } else {
          return s.e2e.executeCallback(callback);
        }
      }));
};

module.exports = new ActivityBar();