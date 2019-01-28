/**
 * @constant
 * @param isSpec
 */
export const openUserMenu = (isSpec = true) => {

  /**
   * @returns {Promise<void>}
   * @private
   */
  async function _spec() {
    const $userInfo = await s.getElementBy('css', '.user-image');
    await s.button.press($userInfo);
  }

  isSpec ? it('Open user menu', async () => await _spec()) : _spec().then();
};

/**
 * @constant
 * @param css
 * @param isSpec
 * @returns {Promise<void>}
 */
export const selectUserMenuItem = (css, isSpec = true) => {

  /**
   * @returns {Promise<void>}
   * @private
   */
  async function _spec() {
    const $menu = await s.getElementBy('css', '.dropdown-menu.show');
    const $item = await s.getElementInsideOfBy(css, $menu, 'Clickable');
    await s.button.press($item);
  }

  if (isSpec) {
    return _spec();
  }

  _spec().then();
};