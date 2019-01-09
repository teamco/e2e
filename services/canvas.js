/**
 * Created by tkachv on 5/15/2017.
 */

/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * Canvas
 * @constructor
 */
const Canvas = function() {

  /**
   * waitForCanvasLoad
   * @method Canvas.waitForCanvasLoad
   * @property Canvas
   * @param $locator
   * @returns {*|promise.Promise<T>|!promise.Promise.<T>|!promise.Thenable.<T>}
   */
  this.waitForCanvasLoad = $locator => browser.executeScript(e => [].some.call(
      e.getContext('2d').getImageData(e.width, e.height, 1, 1), Math.abs), $locator.getWebElement());

  /**
   * renderImage
   * @method Canvas.renderImage
   * @property Canvas
   * @param $locator
   * @returns {*|promise.Promise<T>|!promise.Promise.<T>|!promise.Thenable.<T>}
   */
  this.renderImage = $locator => this.waitForCanvasLoad($locator).then(() =>
      browser.executeScript('return arguments[0].toDataURL();', $locator.getWebElement()));

  /**
   * imageDiff
   * @method Canvas.imageDiff
   * @property Canvas
   * @param $locator
   * @param {string} imgB64
   */
  this.imageDiff = ($locator, imgB64) => expect(this.renderImage($locator)).not.toEqual(imgB64);

  /**
   * closeToolBox
   * @method Canvas.closeToolBox
   * @property Canvas
   */
  this.closeToolBox = () => s.e2e.selectors.pontisActivityBar().then($bar =>
      s.e2e.browser.clickOnElement($bar, () =>
          s.e2e.selectors.menuCanvasContent().then($content =>
              s.e2e.waitForInvisibility($content))));

  /**
   * openToolBox
   * @method Canvas.openToolBox
   * @property Canvas
   * @param {function} [callback]
   */
  this.openToolBox = callback => s.e2e.grid.rowDoubleClick(() =>
      s.e2e.selectors.diHNavTab('app.core#UIDecisioningTabControlDraftProf.tabs[item1]').then(() =>
          s.e2e.selectors.mainCanvas('Displayed').then(() =>
              s.e2e.selectors.menuCanvas().then($menu =>
                  s.e2e.browser.clickOnElement($menu, () =>
                      s.e2e.selectors.menuCanvasContent().then($content => {
                        expect($content.isDisplayed()).toBeTruthy();
                        s.e2e.executeCallback(callback);
                      }))))));

  /**
   * getItemFromToolBox
   * @method Canvas.getItemFromToolBox
   * @property Canvas
   * @param {number} index
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.getItemFromToolBox = index => s.e2e.getElementByIndex(s.e2e.selectors.menuCanvasItems(), index).then($item =>
      s.e2e.waitForPresence($item));

  /**
   * canvasScroll
   * @method Canvas.canvasScroll
   * @property Canvas
   * @param {WebElement} $canvas
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.canvasScroll = $canvas =>
      s.e2e.getSibling($canvas, 'div').then($sibling =>
          s.e2e.getSibling($sibling, 'div').then($scrollArea =>
              s.e2e.browser.elementScrollHeight($scrollArea).then(
                  height => s.e2e.browser.canvasDragNDrop($canvas,
                      {toX: 0, toY: height}))));

  /**
   * addNewItem
   * @method Canvas.addNewItem
   * @property Canvas
   * @param {number} [index]
   * @param {function} [callback]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.addNewItem = (index, callback) => this.getItemFromToolBox(index || 0).then($item =>
      s.e2e.selectors.canvas().then($canvas => {
        const imgBefore = this.renderImage($canvas);
        const saveCreate = s.e2e.selectors.saveCreate;
        const saveNCloseCreate = s.e2e.selectors.saveNCloseCreate;
        s.e2e.activityBar.inactiveButtons(true, saveCreate, saveNCloseCreate);
        this.closeToolBox();
        s.e2e.selectors.canvasDropZone().then($dropArea =>
            s.e2e.browser.dropHtml5To($item, $dropArea, () => {
              // this.canvasScroll($canvas).then(() => {
              s.e2e.activityBar.inactiveButtons(false, saveCreate, saveNCloseCreate);
              this.imageDiff($canvas, imgBefore);
              s.e2e.executeCallback(callback, $canvas);
              // })
            }));
      }));

  /**
   * validatePreferencesTitle
   * @method Canvas.validatePreferencesTitle
   * @property Canvas
   * @param {string} value
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.validatePreferencesTitle = value => s.e2e.selectors.pontisDiName().then($input =>
      $input.getAttribute('value').then(name => expect(name).toEqual(value)));

  /**
   * _popupAction
   * @method _popupAction
   * @param {string} type
   * @param {function} [callback]
   * @private
   */
  const _popupAction = (type, callback) =>
      s.e2e.getElementBy('css', s.e2e.selectors[type]).then($close => s.e2e.browser.clickOnElement($close, callback));

  /**
   * closePreferences
   * @method Canvas.closePreferences
   * @property Canvas
   * @param {function} [callback]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.closePreferences = callback => _popupAction('close', callback);

  /**
   * savePreferences
   * @method Canvas.savePreferences
   * @property Canvas
   * @param {function} [callback]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.savePreferences = callback => _popupAction('saveModal', callback);

  /**
   * updatePreferencesName
   * @method Canvas.updatePreferencesName
   * @property Canvas
   * @param {string} [name]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.updatePreferencesName = name => {
    const text = name || +new Date();
    return s.e2e.input.updateValue(s.e2e.selectors.pontisDiName(), text).then(() =>
        this.savePreferences().then(() => text));
  };

  /**
   * canvasData
   * @method Canvas.canvasData
   * @property Canvas
   * @param canvas
   * @param {string} category
   * @param {number} [index]
   * @return {{}}
   */
  this.canvasData = (canvas, category, index) => {
    index = index || 0;
    let instance = {};
    // let counter = 0;
    // const diagram = angular.element(canvas).scope().myDiagram;
    // diagram.findTopLevelGroups().each(item => {
    //   if (item.data.category === category) {
    //     if (index === counter) instance = item.data;
    //     counter++;
    //   }
    // });
    return instance;
  };

  /**
   * groupData
   * @method Canvas.groupData
   * @property Canvas
   * @param $locator
   * @param {string} category
   * @param {number} [index]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.groupData = ($locator, category, index) =>
      browser.executeScript(this.canvasData, $locator.getWebElement(), category, index);

  /**
   * @method Canvas.getDiagram
   * @property Canvas
   * @param $canvas
   * @return {promise.Thenable<T>|promise.Promise<any>|promise.Promise<T>}
   */
  this.getDiagram = $canvas =>
    browser.executeScript('return angular.element(arguments[0]).scope().myDiagram;', $canvas);

  /**
   * @method Canvas.canvasOffset
   * @property Canvas
   * @param $canvas
   * @return {promise.Thenable<T>|promise.Promise<any>|promise.Promise<T>}
   */
  this.canvasOffset = $canvas => this.getDiagram($canvas).then(diagram => diagram.position);

  /**
   * @method Canvas.getNode
   * @property Canvas
   * @param $canvas
   * @param {string} category
   * @param {number} [index]
   * @return {Thenable<promise.Promise<any>>}
   */
  this.getNode = ($canvas, category, index) =>
    s.e2e.canvas.groupData($canvas, category, index).then(data =>
      this.getDiagram($canvas).then(diagram => diagram.findNodeForData(data)));

  /**
   * @method Canvas.nodeActualBounds
   * @property Canvas
   * @param $canvas
   * @param {string} category
   * @param {number} [index]
   * @return {Thenable<promise.Promise<any>>}
   */
  this.nodeActualBounds = ($canvas, category, index) =>
    this.getNode($canvas, category, index).then(node => node.actualBound);
};

module.exports = new Canvas();
