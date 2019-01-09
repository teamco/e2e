/*jshint esversion: 6 */

const protractor = require('protractor');
const since = require('jasmine2-custom-message');
const EC = protractor.ExpectedConditions;
const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
const ElementFinder = $('').constructor;

/**
 *  from https://stackoverflow.com/questions/27694570/get-all-element-attributes-using-protractor
 *  @example
 *  // var myElement = element(by.id('myId'));
 *  // expect(myElement.getAttributes()).toEqual({'attr1': 'value1', 'attr1': 'value1', ... });
 */
ElementFinder.prototype.getAttributes = function() {
  const $locator = this.getWebElement();
  return browser.executeScript(
    `var items = {}; 
     for (var index = 0; index < arguments[0].attributes.length; ++index) { 
         items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value; 
     } 
     return items;`, $locator);
};

/**
 * @method _executeFn
 * @param [fn]
 * @private
 */
function _executeFn(fn) {
  if (typeof fn === 'function') {
    fn();
  }
}

/**
 * @method _asyncDone
 * @param {Function} done
 * @param {string} type
 * @private
 */
function _asyncDone(done, type) {
  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.log('Async', type);
    done();
  }, 500);
}

/**
 * Services
 * @constructor
 */
const Services = function(elementFinder) {
  /**
   * All keys
   * @type {IKey}
   */
  this.Key = protractor.Key;

  /**
   * @method Services.beforeAll
   * @param [fn]
   */
  this.beforeAll = fn => {
    const that = this;
    beforeAll(function(done) {

      /**
       * <c> - Context.
       * @global global <this> scope
       * @property global
       * @example
       * //   beforeAll(function() {
       * //     c = this;
       * //     c[<namespace>] = {<structure>};
       * //   });
       */
      global.c = this;

      _asyncDone(done, 'beforeAll');
      that.login.doLogin(that.login.TYPE.positive.name).then(async () => {
        await that.branch.handleBranch('later');
        //await that.branch.handleBranch('delete');
        await that.branch.handleBranch('new');
        await _executeFn(fn);
      });
    });
  };

  /**
   * @method Services.beforeEach
   * @param [fn]
   */
  this.beforeEach = fn => {
    const that = this;
    beforeEach(function(done) {
      global.c = this;
      _asyncDone(done, 'beforeEach');
      that.activeElement();
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 720000;
      _executeFn(fn);
    });
  };

  /**
   * @method Services.afterEach
   * @param [fn]
   */
  this.afterEach = fn => {
    afterEach(function(done) {
      global.c = this;
      _asyncDone(done, 'afterEach');
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      _executeFn(fn);
    });
  };

  /**
   * @method Services.afterAll
   * @param fn
   */
  this.afterAll = fn => {
    const that = this;
    afterAll(function(done) {
      global.c = this;
      _asyncDone(done, 'afterAll');
      that.login.doLogout().
      then(() => _executeFn(fn)).
      then(() => global.c = null);
    });
  };

  /**
   * @method Services.preConfig
   * @param {{beforeAll, beforeEach, afterEach, afterAll}} [opts]
   */
  this.preConfig = opts => {
    opts = opts || {};
    this.beforeAll(opts.beforeAll);
    this.beforeEach(opts.beforeEach);
    this.afterEach(opts.afterEach);
    this.afterAll(opts.afterAll);
  };

  /**
   * define
   * @method Services.define
   * @property Services
   * @param value
   * @param _default
   * @returns {*}
   */
  this.define = (value, _default) => typeof value === 'undefined' ? _default : value;

  /**
   * fixJSON
   * @method Services.fixJSON
   * @property Services
   * @param {string} json
   * @returns {XML|string}
   */
  this.fixJSON = json => json.replace((/([\w]+)(:)/g), '"$1"$2').replace((/'/g), '"');

  /**
   * isPromise
   * @method Services.isPromise
   * @property Services
   * @param {WebElement|Promise} $locator
   * @returns {boolean}
   */
  this.isPromise = $locator => !!$locator.then;

  /**
   * generateColor
   * @method Services.generateColor
   * @property Services
   * @returns {string}
   */
  this.generateColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++)
      color += letters[Math.floor(Math.random() * 16)];
    return color;
  };

  /**
   * @method Services.highlightElement
   * @property Services
   * @param {{getWebElement, getWebElements, getAttribute}} $locator
   * @param {string} [tColor]
   * @returns {promise.Promise.<T>|*}
   */
  this.highlightElement = ($locator, tColor) => {
    if (!$locator) return false;

    $locator.getAttribute('style').then(style => {
      if (typeof $locator.getWebElement !== 'function') {
        if (typeof $locator.getWebElements === 'function') {
          // TODO (Tkachv): Array of elements
        }
        return false;
      }

      // Generate color
      const color = tColor || this.generateColor();

      /**
       * script
       * @type {promise.Promise.<T>}
       */
      const script = browser.driver.executeScript(
        'arguments[0].style.boxShadow="";' +
        'arguments[0].setAttribute(\'style\', arguments[1]);',
        $locator.getWebElement(),
        style + ';box-shadow:inset 0 0 0 2px ' + color +
        ',0 0 0 2px ' + color + ';'
      );

      return script.then(() => {
        browser.sleep(500);
        return $locator;
      });
    });
  };

  /**
   * @method Services.cursorTracker
   * @property Services
   * @param {{x, y, container: string}|boolean} opts
   * @returns {promise.Promise.<T>|*}
   */
  this.cursorTracker = opts => {
    /**
     * @method _addCursor
     * @param x
     * @param y
     * @param container
     * @private
     */
    function _addCursor(x, y, container) {
      let cursor = document.querySelector('#mouse-tracker');
      if (!cursor) {
        cursor = document.createElement('div');
        cursor.id = 'mouse-tracker';
        cursor.style.backgroundColor = 'transparent';
        cursor.style.height = '10px';
        cursor.style.width = '10px';
        cursor.style.borderRadius = '10px';
        cursor.style.borderColor = 'yellow';
        cursor.style.borderStyle = 'solid';
        cursor.style.borderWidth = '3px';
        cursor.style.boxShadow = '1px 1px 3px #999';
        cursor.style.position = 'absolute';
        cursor.style.zIndex = '9000';
      }
      const $container = document.querySelector(container || 'body');
      $container.appendChild(cursor);
      cursor.style.top = $container.offsetTop + y + 'px';
      cursor.style.left = $container.offsetLeft + x + 'px';
    }

    /**
     * @method _removeCursor
     * @private
     */
    function _removeCursor() {
      let cursor = document.querySelector('#mouse-tracker');
      cursor.parentNode.removeChild(cursor);
    }

    if (!opts) {
      browser.driver.executeScript(_removeCursor);
      return false;
    }

    return browser.driver.executeScript(_addCursor, opts.x, opts.y, opts.container);
  };

  /**
   * mouseTracker
   * @method Services.mouseTracker
   * @property Services
   * @param $locator
   * @param {string} type
   * @param {boolean} [remove]
   * @returns {promise.Promise.<T>|*}
   */
  this.mouseTracker = ($locator, type, remove) => {
    /**
     * _tracker
     * @param {{x: number, y: number}} location
     * @param {string} type
     * @param {boolean} remove
     * @param {string} color
     * @private
     */
    const _tracker = (location, type, remove, color) => {
      const css = 'mouse-tracker';
      const $div = document.createElement('div');
      const $text = document.createTextNode(type);
      const $mouse = document.getElementsByClassName(css);
      const style = [
        'top:' + location.y + 'px',
        'left:' + location.x + 'px',
        'border:2px solid ' + color,
        'position:absolute', 'background-color:#fff',
        'box-shadow:1px 1px 3px #333', 'border-radius:2px',
        'font-size:11px', 'color: #333', 'padding:2px 5px',
        'z-index:9999', 'pointer-events:none'
      ].join(';');
      $div.setAttribute('class', css);
      $div.setAttribute('style', style);
      $div.appendChild($text);
      if ($mouse.length && remove) document.body.removeChild($mouse[0]);
      setTimeout(() => {
        if ($mouse.length) document.body.removeChild($mouse[0]);
      }, 1000);
      document.body.appendChild($div);
    };

    if (!$locator) return false;

    if (typeof $locator.getLocation !== 'function') {
      debugger;
    }

    return $locator.getLocation().then(location =>
      browser.executeScript(_tracker, location, type,
        typeof remove === 'undefined' ? true : remove,
        this.generateColor()));
  };

  /**
   * _waitFor
   * @param {string} type
   * @param $locator
   * @param {number} timeout
   * @param {boolean} [_not]
   * @returns {*}
   * @private
   */
  function _waitFor(type, $locator, timeout, _not) {
    let waitOn = EC[type]($locator);
    if (_not) {
      waitOn = EC.not(waitOn);
    }
    return browser.wait(waitOn, timeout).then(condition => {
      expect(condition).toBeTruthy();
      return $locator;
    });
  }

  /**
   * _getCondition
   * @param {string} condition
   * @returns {*}
   * @private
   */
  function _getCondition(condition) {
    if (condition.match(/>/)) return 'toBeGreaterThan';
    if (condition.match(/</)) return 'toBeLessThan';
    if (condition.match(/=/)) return 'toEqual';
    return condition;
  }

  /**
   * @property Services
   * @type {Browser}
   */
  this.browser = require('./browser.js');

  /**
   * @property Services
   * @type {Button}
   */
  this.button = require('./button.js');

  /**
   * @property Services
   * @type {Canvas}
   */
  this.canvas = require('./canvas.js');

  /**
   * @property Services
   * @type {Grid}
   */
  this.grid = require('./grid.js');

  /**
   * @property Services
   * @type {KendoGrid}
   */
  this.kendoGrid = require('./kendoGrid.js');

  /**
   * @property Services
   * @type {Grid}
   */
  this.navigation = require('./navigation.js');

  /**
   * @property Services
   * @type {Input}
   */
  this.input = require('./input.js');

  /**
   * @property Services
   * @type {Login}
   */
  this.login = require('./login.js');

  /**
   * @property Services
   * @type {Selectors}
   */
  this.selectors = require('./selectors.js');

  /**
   * @property Services
   * @type {Branch}
   */
  this.branch = require('./branch');

  /**
   * @property Services
   * @type {Checkbox}
   */
  this.checkbox = require('./checkbox.js');

  /**
   * @property Services
   * @type {Header}
   */
  this.header = require('./header.js');

  /**
   * @property Services
   * @type {ActivityBar}
   */
  this.activityBar = require('./activity.bar.js');

  /**
   * @property Services
   * @type {Form}
   */
  this.form = require('./form.js');

  /**
   * @property Services
   * @type {Upload}
   */
  this.upload = require('./upload.js');

  /**
   * @property Services
   * @type {Select}
   */
  this.select = require('./select.js');

  /**
   * @property Services
   * @type {Tagset}
   */
  this.tagset = require('./tagset.js');

  /**
   * @property Services
   * @type {Collapse}
   */
  this.collapse = require('./collapse.js');

  /**
   * DEFAULT_TIMEOUT
   * @property Services
   * @type {number}
   */
  this.DEFAULT_TIMEOUT = 30000;

  /**
   * getElementBy
   * @property Services
   * @param {string} locateBy
   * @param {string} value
   * @param {string} [type]
   */
  this.getElementBy = (locateBy, value, type) => {
    const $element = element(by[locateBy](value));
    // const $locator = $element.locator();
    // console.log($locator.using, $locator.value, locateBy, value);
    return this['waitFor' + (type ? type : 'Presence')]($element);
  };

  /**
   * getElementInsideOfBy
   * @property Services
   * @param {string} cssValue
   * @param searchIn
   * @param {string} [type]
   */
  this.getElementInsideOfBy = (cssValue, searchIn, type) => {
    type = type ? type : 'Presence';
    // const $element = searchIn.$$(cssValue).first();
    // const $locator = $element.locator();
    // console.log(">>>>>", $locator.using, "\n>>>>", $locator.value, "\n>>>", cssValue, "\n>>", searchIn.locator().value);

    return this['waitFor' + type](searchIn.$$(cssValue).first());
  };

  /**
   * getElementsInsideOfBy
   * @property Services
   * @param {string} cssValue
   * @param [searchIn]
   */
  this.getElementsInsideOfBy = (cssValue, searchIn) => searchIn ? searchIn.$$(cssValue) : $$(cssValue);

  /**
   * getElementsBy
   * @property Services
   * @param type
   * @param value
   * @param [searchIn]
   * @returns {ElementArrayFinder}
   */
  this.getElementsBy = (type, value, searchIn) => (searchIn || element).all(by[type](value));

  /**
   * @method getVisibleElementsBy
   * @param {string} cssValue
   * @param {ElementFinder} [searchIn]
   * @returns {ElementArrayFinder}
   */
  this.getVisibleElementsBy = (cssValue, searchIn) => {
    const locators = this.getElementsInsideOfBy(cssValue, searchIn);
    return locators.filter($locator => $locator.isDisplayed());
  };

  /**
   * @method getNotVisibleElementsBy
   * @param {string} cssValue
   * @param {ElementFinder} [searchIn]
   * @returns {ElementArrayFinder}
   */
  this.getNotVisibleElementsBy = (cssValue, searchIn) => {
    const locators = this.getElementsInsideOfBy(cssValue, searchIn);
    return locators.filter($locator => !$locator.isDisplayed());
  };

  /**
   * getElementsContainingText
   * @property Services
   * @param {string} selector
   * @param {string} text
   * @param [searchIn]
   * @returns {ElementArrayFinder}
   */
  this.getElementsByText = async (selector, text, searchIn) => {
    this.browser.wait(500);
    return (searchIn || element).all(by.cssContainingText(selector, text));
  };

  /**
   * getElementByText
   * @method Services.getElementByText
   * @property Services
   * @param {string} cssValue
   * @param {string} text
   * @param {string} [type]
   * @returns {*}
   */
  this.getElementByText = (cssValue, text, type) =>
    this['waitFor' + (type ? type : 'Presence')](element(by.cssContainingText(cssValue, text)));

  /**
   * getElementByTextInsideOf
   * @method Services.getElementByTextInsideOf
   * @property Services
   * @param {string} cssValue
   * @param {string} text
   * @param searchIn
   * @param {string} [type]
   * @returns {*}
   */
  this.getElementByTextInsideOf = (cssValue, text, searchIn, type) => {
    type = type ? type : 'Presence';
    return this['waitFor' + type](
      searchIn.element(by.cssContainingText(cssValue, text)));
  };

  /**
   * getCount
   * @property Services
   * @param $locators
   */
  this.getCount = $locators => $locators.count();

  /**
   * getNtnFirstElement
   * @property Services
   * @param $locators
   * @param {number} [index]
   * @param {string} [type]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.getNtnFirstElement = ($locators, index, type) => {
    index = typeof index === 'undefined' ? 0 : index;
    const $locator = $locators.get(index);
    return this['waitFor' + (type ? type : 'Presence')]($locator);
  };

  /**
   * getNtnLastElement
   * @property Services
   * @param $locators
   * @param {number} [index]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.getNtnLastElement = ($locators, index) => this.getCount($locators).then(count => {
    index = typeof index === 'undefined' ? 0 : index;
    return this.getNtnFirstElement($locators, count - index);
  });

  /**
   * @property Services
   * @method Services.getParentElement
   * @param $locator
   */
  this.getParentElement = $locator => $locator.element(by.xpath('..'));

  /**
   * checkCount
   * @property Services
   * @param $locators
   * @param {string} condition
   * @param expected
   * @param callback
   * @returns {*|Promise.<TResult>|!Thenable.<R>}
   */
  this.checkCount = ($locators, condition, expected, callback) =>
    this.getCount($locators).then(count => {
      let isNegative = !!condition.match(/!/);
      condition = _getCondition(condition);
      const expectation = expect(count);
      isNegative ?
        expectation.not[condition](expected) :
        expectation[condition](expected);
      return this.executeCallback(callback, count);
    });

  /**
   * getElementByIndex
   * @property Services
   * @param $locators
   * @param index
   * @returns {*|Promise.<TResult>|!Thenable.<R>}
   */
  this.getElementByIndex = ($locators, index) =>
    this.browser.wait().then(() => this.checkCount($locators, '!<', index, () => $locators.get(index)));

  /**
   * getSibling
   * @property Services
   * @param $locator
   * @param {string} tagName
   * @param {boolean} [previous]
   * @param {string|*} [type]
   * @returns {ElementFinder|*}
   */
  this.getSibling = ($locator, tagName, previous, type) => {
    const sibling = previous ? 'preceding' : 'following';
    return this['waitFor' + (type ? type : 'Presence')]($locator.element(by.xpath(sibling + '-sibling::' + tagName)));
  };

  /**
   * getClassNames
   * @property Services
   * @param $locator
   * @param {string} [type]
   * @returns {promise.Promise<R>|*}
   */
  this.getClassNames = ($locator, type) =>
    this['waitFor' + (type ? type : 'Presence')]($locator).then(() => $locator.getAttribute('class'));

  /**
   * shouldClassName
   * @method Services.shouldClassName
   * @property Services
   * @param $locator
   * @param {string} className
   * @param {boolean} condition
   * @param {string} [text]
   * @returns {*}
   */
  this.shouldClassName = ($locator, className, condition, text) =>
    this.getClassNames($locator).then(css => {
      if (text) {
        since(`>>> Should${condition ? `` : `n't`} ClassName: ${className} in ${text}`);
      }
      condition ? expect(css).toMatch(className) : expect(css).not.toMatch(className);
    });

  /**
   * shouldMatchToClassName
   * @method Services.shouldMatchToClassName
   * @property Services
   * @param $locator
   * @param {string} className
   * @param {boolean} condition
   * @returns {*}
   */
  this.shouldMatchToClassName = ($locator, className, condition) => {
    const regExp = new RegExp(className);
    return this.getClassNames($locator).then(css =>
      condition ? expect(css).toMatch(regExp) : expect(css).not.toMatch(regExp));
  };

  /**
   * hasClassName
   * @method Services.hasClassName
   * @property Services
   * @param $locator
   * @param {string} className
   * @returns {Promise<boolean>}
   */
  this.hasClassName = async ($locator, className) => {
    const classNames = (await this.getClassNames($locator)).split(' ');
    return classNames.indexOf(className) !== -1;
  };

  /**
   * Waits while $locator receives expected state for attribute
   * @method Services.waitForAttr
   * @property Services
   * @param $locator - element finder
   * @param attrName - attribute name to detect
   * @param {function(string)} detectState - function receives attribute value and returns boolean or promise
   * (truthy if state is reached)
   * @param timeout
   * @returns {Promise<*|promise.Promise<any>|!Thenable<T>|promise.Thenable<T>|WebElementPromise|"ok"|"not-equal"|"timed-out">}
   */
  this.waitForAttr = async ($locator, attrName, detectState, timeout = this.DEFAULT_TIMEOUT) =>
    browser.wait(
      async () => $locator.getAttribute(attrName).then(_ => detectState(_ || '')),
      timeout);

  /**
   * Waits while $locator receives expected state for class attribute
   * @method Services.waitForClassAttr
   * @property Services
   * @param $locator - element finder
   * @param {function(string)} detectState - function receives attribute value and returns boolean or promise
   * (truthy if state is reached)
   * @param timeout
   * @returns {Promise<*|promise.Promise<any>|!Thenable<T>|promise.Thenable<T>|WebElementPromise|"ok"|"not-equal"|"timed-out">}
   */
  this.waitForClassAttr = async ($locator, detectState, timeout = this.DEFAULT_TIMEOUT) =>
    this.waitForAttr($locator, 'class', detectState, timeout);

  /**
   * Waits while $locator receives expected state for inner text
   * @method Services.waitForText
   * @property Services
   * @param $locator - element finder
   * @param {function(string)} detectState - function receives text value and returns boolean or promise
   * (truthy if state is reached)
   * @param timeout
   * @returns {Promise<*|promise.Promise<any>|!Thenable<T>|promise.Thenable<T>|WebElementPromise|"ok"|"not-equal"|"timed-out">}
   */
  this.waitForText = async ($locator, detectState, timeout = this.DEFAULT_TIMEOUT) =>
    browser.wait(async () => $locator.getText().then(_ => detectState(_.trim() || '')), timeout);

  /**
   * builds value comparator that verifies that text value is in expected state according to other params
   * @method Services.getTextDetector
   * @property Services
   * @param {string} desiredValue - desired value to compare
   * @param {boolean} [present] - allows detect whether value exist or not
   * @param {boolean} [exact] - forces exact value comparison
   * @returns {function(string):boolean}
   */
  this.getTextDetector = (desiredValue, {present = true, exact = true} = {}) =>
    value => // todo: case insensitive
      (!!present) === (exact ? value === desiredValue : value.indexOf(desiredValue) !== -1);

  /**
   * builds value comparator that verifies that attribute value is in expected state according to other params
   * @method Services.getAttrDetector
   * @property Services
   * @param {string} desiredValue - desired value to compare
   * @param {boolean} [present] - allows detect whether value exist or not
   * @param {boolean} [exact] - forces exact value comparison
   * @returns {function(string):boolean}
   */
  this.getAttrDetector = (desiredValue, {present = true, exact = true} = {}) =>
    value =>
      (!!present) === (exact ? value === desiredValue : value.indexOf(desiredValue) !== -1);

  /**
   * builds value comparator that verifies that class attribute value is in expected state according to other params
   * @method Services.getClassNameDetector
   * @property Services
   * @param {string} desiredValue - desired class name (or part) to compare
   * @param {boolean} [present] - allows to detect whether class exist or not
   * @param {boolean} [exact] - forces exact class name comparison
   * @returns {function(string):boolean}
   */
  this.getClassNameDetector = (desiredValue, {present = true, exact = true} = {}) =>
    attrValue =>
      (!!present) === ((exact ? attrValue.split(' ') : attrValue).indexOf(desiredValue) !== -1);

  /**
   * waits while $locator receives expected class state
   * @method Services.waitForClass
   * @property Services
   * @param $locator - element finder
   * @param {string} desiredClass - desired class name (or part) to compare
   * @param {boolean} [present] - makes function to detect whether class exist or not
   * @param {boolean} [exact] - forces exact class name comparison
   * @param [timeout]
   * @returns {Promise<*|promise.Promise<any>|!Thenable<T>|promise.Thenable<T>|WebElementPromise|string>}
   */
  this.waitForClass =
    async ($locator, desiredClass, {present = true, exact = true, timeout = this.DEFAULT_TIMEOUT} = {}) =>
      this.waitForClassAttr($locator, this.getClassNameDetector(desiredClass, {present, exact}), timeout);

  /**
   * validateText
   * @method Services.validateText
   * @property Services
   * @param {WebElement} $locator
   * @param {string} source
   * @returns {promise.Promise<R>|*}
   */
  this.validateText = ($locator, source) =>
    this.waitForPresence($locator).then(() => $locator.getText().then(target =>
      expect(target.toLowerCase()).toEqual(source.toLowerCase())));

  /**
   * forEachBreakOn
   * @method Services.forEachBreakOn
   * @property Services
   * @param {Array} array
   * @param {number} i
   * @returns {Buffer|string|Array.<T>}
   */
  this.forEachBreakOn = (array, i) => array.concat(array.splice(i, array.length - i));

  /**
   * getCss
   * @property Services
   * @param $locator
   * @param {string} cssKey
   * @returns {!promise.Thenable.<string>|!webdriver.promise.Promise.<string>|promise.Promise.<string>|!webdriver.promise.Promise.<string>|promise.Promise<string>|!promise.Thenable.<string>}
   */
  this.getCss = ($locator, cssKey) => $locator.getCssValue(cssKey);

  /**
   * @method isPresent
   * @param $locator
   * @returns {Promise<*|boolean>}
   */
  this.isPresent = async $locator => {
    const present = await this.waitForStalenessOf($locator);
    return present.isPresent();
  };

  /**
   * waitForGlobalLoader
   * @method Services.waitForGlobalLoader
   * @property Services
   * @returns {promise.Promise<R>|*}
   */
  this.waitForGlobalLoader = () => this.selectors.globalLoader(true).then(() => this.selectors.globalLoader(false));

  /**
   * waitForLocalLoader
   * @method Services.waitForLocalLoader
   * @property Services
   * @returns {promise.Promise<R>|*}
   */
  this.waitForLocalLoader = () => this.selectors.localLoader(true).then(() => this.selectors.localLoader(false));

  /**
   * waitForNone - stub that doesnt wait
   * @method Services.waitForNone
   */
  this.waitForNone = async ($locator) => {
    this.highlightElement($locator);
    return $locator;
  };

  /**
   * @method _waitForAttribute
   * @param $locator
   * @param attrName
   * @param attrValue
   * @param [timeout]
   * @param _not
   * @returns {promise.Promise<any>}
   */
  this.waitForAttribute = ($locator, attrName, attrValue, timeout = this.DEFAULT_TIMEOUT, _not = false) => {
    let waitOn = EC['presenceOf']($locator);
    if (_not) {
      waitOn = EC.not(waitOn);
    }
    return browser.wait(waitOn, timeout).then(condition => {
      expect(condition).toBeTruthy();
      return $locator.getAttribute(attrName).then(value => _not ?
        !value || (value && value.indexOf(attrValue) < 0) :
        value && value.indexOf(attrValue) >= 0);
    });
  };

  /**
   * waitForPresence
   * @property Services
   * @param $locator
   * @param {number} [timeout]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.waitForPresence = ($locator, timeout) => {
    const promise = _waitFor('presenceOf', $locator, timeout || this.DEFAULT_TIMEOUT);
    this.highlightElement($locator);
    return promise;
  };

  /**
   * waitForStalenessOf
   * @property Services
   * @param $locator
   * @param {number} [timeout]
   * @returns {*}
   */
  this.waitForStalenessOf = ($locator, timeout) => browser.wait(EC.or(
    EC.stalenessOf($locator), EC.invisibilityOf($locator)), timeout || this.DEFAULT_TIMEOUT);

  /**
   * waitForNotPresence
   * @property Services
   * @method Services.waitForNotPresence
   * @param $locator
   * @param {number} [timeout]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.waitForNotPresence = ($locator, timeout) => _waitFor('presenceOf', $locator, timeout ||
    this.DEFAULT_TIMEOUT, true);

  /**
   * waitForAlert
   * @method Services.waitForAlert
   * @property Services
   * @param {number} [timeout]
   * @returns {*|promise.Promise<R>}
   */
  this.waitForAlert = timeout => browser.wait(EC.alertIsPresent(),
    timeout || this.DEFAULT_TIMEOUT).then(condition =>
    expect(condition).toBe(true));

  /**
   * waitForClickable
   * @method Services.waitForClickable
   * @property Services
   * @param $locator
   * @param {number} [timeout]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.waitForClickable = ($locator, timeout) => {
    const promise = _waitFor('elementToBeClickable', $locator, timeout || this.DEFAULT_TIMEOUT);
    this.highlightElement($locator);
    return promise;
  };

  /**
   * waitForDisplayed
   * @method Services.waitForDisplayed
   * @property Services
   * @param $locator
   * @param  [timeout]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.waitForDisplayed = ($locator, timeout) =>
    this.waitForPresence($locator, timeout).then(() => {
      this.highlightElement($locator);
      expect($locator.isDisplayed()).toBeTruthy();
      return $locator;
    });

  /**
   * waitForInvisibility
   * @property Services
   * @param $locator
   * @param timeout
   * @returns {*}
   */
  this.waitForInvisibility = ($locator, timeout) => _waitFor('invisibilityOf',
    $locator, timeout || this.DEFAULT_TIMEOUT);

  /**
   * executeCallback
   * @method Services.executeCallback
   * @property Services
   * @param {function} [callback]
   * @returns {*}
   */
  this.executeCallback = function(callback) {
    if (typeof callback === 'function') {
      return callback.apply(this, Array.prototype.slice.call(arguments, 1));
    }
  };

  /**
   * executeCallbackPromise
   * @method Services.executeCallbackPromise
   * @property Services
   * @param {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)} promise
   * @param {boolean} execute
   * @param {function} [callback]
   * @param {*} [*]
   * @returns {*}
   */
  this.executeCallbackPromise = function(promise, execute, callback) {
    if (typeof callback === 'function') {
      const args = Array.prototype.slice.call(arguments, 3);
      if (execute) {
        return promise.then(() => {
          callback.apply(this, args);
        });
      }
      return promise.then(callback);
    }
  };

  /**
   * handleModalDialog
   * @method Services.handleModalDialog
   * @property Services
   * @param {string} type
   * @param {function} [callback]
   */
  this.handleModalDialog = (type, callback) =>
    this.selectors.modalDialog().then($modal =>
      this.selectors.modalBody($modal).then($body => {
        this.shouldClassName($body, type, true);
        this.selectors.modalOkButton($modal).then($ok =>
          this.button.press($ok, () =>
            this.waitForInvisibility($modal).then(() =>
              this.executeCallback(callback))));
      }));

  /**
   * handleToastError
   * @method Services.handleToastError
   * @property Services
   * @param {function} [callback]
   * @param {function} [fallback]
   */
  this.handleToastError = (callback, fallback) =>
    this.selectors.toast().then($toast =>
      $toast.isPresent().then(present => {
        present ?
          this.executeCallback(fallback) :
          this.executeCallback(callback);
      }));

  /**
   * defaultContent
   * @method Services.defaultContent
   * @property Services
   */
  this.defaultContent = () => browser.switchTo().defaultContent();

  /**
   * activeElement
   * @method Services.activeElement
   * @property Services
   */
  this.activeElement = () => browser.switchTo().activeElement();

  /**
   * isActiveElement
   * @method Services.isActiveElement
   * @property Services
   */
  this.isActiveElement = $locator => expect($locator).equals(this.activeElement());

  /**
   * elementLocation
   * @method Services.elementLocation
   * @property Services
   */
  this.elementLocation = $locator => $locator.getLocation();

  /**
   * @method Services.getStyleParameter
   * @property Services
   * @param {string} style
   * @param {string} type
   */
  this.getStyleParameter = (style, type) => {
    const res = style.split(';').filter(value => value.includes(type));
    expect(res.length).toBeGreaterThan(0);
    return res[0].replace(/ /g, '');
  };

  /**
   * @method Services.getElementStyleParameter
   * @property Services
   * @param {ElementFinder} $element
   * @param {string} param
   */
  this.getElementStyleParameter = async ($element, param) => {
    const style = await $element.getAttribute('style');
    const res = style.split(';').filter(value => value.includes(param));
    expect(res.length).toBeGreaterThan(0);
    return res[0].replace(/ /g, '').split(':')[1];
  };

  /**
   * @property Services
   * @method Services.getVisibleTooltip
   * @returns {Promise<void>}
   */
  this.getVisibleTooltip = async () => await this.getElementBy('css', 'div.ant-tooltip:not(.ant-tooltip-hidden)');

  /**
   * @property Services
   * @method Services.isDisabled
   * @param {ElementFinder} $el
   * @returns {Promise<boolean>}
   */
  this.isDisabled = async $el => {
    const res = await $el.getAttribute('disabled');
    return res === 'true';
  };

  /**
   * @property Services
   * @method Services.navigateTo
   * @param {string} menuName
   * @param {string} path
   */
  this.navigateTo = (menuName, path) => {
    const parentMenuName = menuName;
    const s = this;
    describe(`Navigate to the target: ${parentMenuName}/${path}`,
      async () => await s.navigation.navigateValidator(parentMenuName, path));
  };
};

exports.e2e = new Services();
