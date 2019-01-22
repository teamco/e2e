/**
 * @constant
 * @param user
 * @param password
 */
const negativeLogin = (user, password) => {
  it(`Negative Login: ${user}:${password}`, async () => {

  });
};

/**
 * @constant
 * @param user
 * @param password
 */
const positiveLogin = (user, password) => {
  it(`Positive Login: ${user}:${password}`, async () => {

  });
};

/**
 * @constant
 */
const resetLoginForm = async () => {
  await fillLoginForm('user', 'password');
  await it('Reset login form', async () => {
    const $reset = await s.getElementBy('css', '#new_user button[type="reset"]');
    await s.button.press($reset);
  });
};

/**
 * @constant
 * @param user
 * @param password
 * @returns {Promise<void>}
 */
const fillLoginForm = (user, password) => {
  it(`Fill login form data: ${user}:${password}`, async () => {
    const $user = s.getElementBy('id', 'user_email');
    const $password = s.getElementBy('id', 'user_password');
    const $remember = await s.getElementBy('id', 'user_remember_me');
    await s.input.updateValue($user, user);
    await s.input.updateValue($password, password);
    await s.checkbox.toggle($remember);
  });
};

/**
 * @constant
 */
const doLogin = () => {
  it('Fill login form data', async () => {
    const $submit = await s.getElementBy('css', '#new_user button[type="submit"]');
    await s.button.press($submit);
  });
};

/**
 * @export
 * @param user
 * @param password
 * @param isPositive
 * @returns {Promise<void>}
 */
export const login = async (user, password, isPositive = true) => {
  await resetLoginForm();
  await fillLoginForm(user, password);
  await doLogin();
  if (isPositive) {
    await positiveLogin(user, password);
  } else {
    await negativeLogin(user, password);
  }
};