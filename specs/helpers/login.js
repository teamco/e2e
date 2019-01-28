import {openUserMenu, selectUserMenuItem} from './userMenu';

/**
 * @returns {*}
 */
function get$user() {
  return _get$locator('user_email');
}

/**
 * @returns {*}
 */
function get$password() {
  return _get$locator('user_password');
}

/**
 * @returns {*}
 */
function get$remember() {
  return _get$locator('user_remember_me');
}

/**
 * @param id
 * @returns {*}
 * @private
 */
function _get$locator(id) {
  return s.getElementBy('id', id);
}

/**
 * @constant
 */
const negativeLogin = () => {
  it('Negative Login', async () => {
    await get$user();
  });
};

/**
 * @constant
 */
const positiveLogin = () => {
  it('Positive Login', async () => {
    await s.getElementBy('css', '.user-image');
  });
};

/**
 * @constant
 */
const resetLoginForm = () => {
  it('Reset login form', async () => {
    const $reset = await s.getElementBy('css', '#new_user button[type="reset"]');
    await s.button.press($reset);
    const $user = await get$user();
    const $password = await get$password();
    expect($user.getText()).toBe('');
    expect($password.getText()).toBe('');
  });
};

/**
 * @constant
 * @param user
 * @param password
 */
const fillLoginForm = (user, password) => {
  it(`Fill login form data: ${user}:${password}`, async () => {
    const $user = get$user();
    const $password = get$password();
    const $remember = await get$remember();
    await s.input.updateValue($user, user);
    await s.input.updateValue($password, password);
    await s.checkbox.check($remember);
  });
};

/**
 * @constant
 */
const doLogin = () => {
  it('Submit login form', async () => {
    const $submit = await s.getElementBy('css', '#new_user button[type="submit"]');
    await s.button.press($submit);
  });
};

/**
 * @export
 * @constant
 */
export const doLogout = (isSpec = true) => {
  openUserMenu(isSpec);
  it('Do logout', async () => {
    await selectUserMenuItem('a[href="/users/sign_out"]', isSpec);
    await get$user();
  });
};

/**
 * @export
 * @param user
 * @param password
 * @param isPositive
 */
export const login = (user, password, isPositive = true) => {
  fillLoginForm(user, password);
  doLogin();
  isPositive ? positiveLogin() : negativeLogin();
};

/**
 * @constant
 */
export const resetLogin = () => {
  fillLoginForm('user', 'password');
  resetLoginForm();
};