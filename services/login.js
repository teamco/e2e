/**
 * @constant
 * @type {Services}
 */
const s = require('./main.js');

/**
 * @method Login
 * @constructor
 */
const Login = function() {

  /**
   * _positiveLogin
   * @method _positiveLogin
   * @private
   */
  function _positiveLogin() {
    s.e2e.selectors.mainLayout().then(
      // TODO (Tkachv): some functionality
    );
  }

  /**
   * _negativeLogin
   * @method _negativeLogin
   * @private
   */
  function _negativeLogin() {
    s.e2e.selectors.loginFailed().then($loginFail => s.e2e.waitForDisplayed($loginFail));
  }

  /**
   * _emptyLogin
   * @method _emptyLogin
   * @private
   */
  function _emptyLogin() {
    s.e2e.selectors.userName().then($user =>
      s.e2e.getSibling(s.e2e.getParentElement($user), 'div', false, 'Presence'));
    s.e2e.selectors.userPassword().then($password =>
      s.e2e.getSibling(s.e2e.getParentElement($password), 'div', false, 'Presence'));
  }

  /**
   * enterUserName
   * @method enterUserName
   * @property Login
   * @param {string} userName
   */
  this.enterUserName = userName => s.e2e.input.updateValue(s.e2e.selectors.userName(), userName);

  /**
   * enterPassword
   * @method enterPassword
   * @property Login
   * @param {string} password
   */
  this.enterPassword = password => s.e2e.input.updateValue(s.e2e.selectors.userPassword(), password);

  /**
   * @property Login.TYPE
   * @type {{
   *    positive: {name: string, fn: _positiveLogin},
   *    negative: {name: string, fn: _negativeLogin},
   *    empty: {name: string, fn: _emptyLogin}
   * }}
   */
  this.TYPE = {
    positive: {
      name: 'positive',
      fn: _positiveLogin
    },
    negative: {
      name: 'negative',
      fn: _negativeLogin
    },
    empty: {
      name: 'empty',
      fn: _emptyLogin
    }
  };

  /**
   * @property Login.configuration
   * @type {{pathname: string, title: string}}
   */
  this.configuration = {
    pathname: '/',
    title: 'Amdocs aia'
  };

  /**
   * @method doLogin
   * @property Login
   * @param {string} type
   * @param {{[userName]: string, [password]: string, [pathname]: string, [title]: string}} [opts]
   * @returns {Thenable<Thenable<T>>}
   */
  this.doLogin = (type, opts) => {

    opts = opts || {};
    opts = Object['assign']({}, this.configuration, opts);

    /**
     * @constant _is
     * @type {{name: string, fn: Function}}
     */
    const _is = this.TYPE[type];
    expect(_is).not.toBeUndefined();
    const _positive = this.TYPE.positive.name;
    const userName = type === _positive ? 'aiauser' : opts.userName;
    const password = type === _positive ? 'aiauser' : opts.password;

    s.e2e.browser.maximize();
    s.e2e.browser.deleteAllCookies();
    s.e2e.browser.disableSynchronization();
    s.e2e.browser.validateTitle(opts.pathname, opts.title);

    this.enterUserName(userName);
    this.enterPassword(password);

    const _validate = _is.fn;

    return s.e2e.selectors.loginButton().then($loginBtn => s.e2e.button.press($loginBtn, _validate));
  };

  /**
   * @method doLogout
   * @property Login
   * @returns {Thenable<Thenable<T>>}
   */
  this.doLogout = () => s.e2e.header.logout();
};

module.exports = new Login();
