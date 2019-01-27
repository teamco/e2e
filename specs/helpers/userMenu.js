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

  isSpec ? it('Open user menu', async () => _spec) : _spec().then();
};

/**
 * @constant
 * @param css
 * @param isSpec
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

  isSpec ? it('Select user menu item', async () => _spec) : _spec().then();
};