/**
 * e2e
 * @name grid.test
 * @author tkachv
 * @date 3/8/2018
 * @time 1:18 PM
 */
describe('Grid', () => {

  /**
   * Simplify services
   * @type {Services}
   */
  const s = require('./../../../../services/main.js').e2e;

  s.navigateTo('Analytics', 'profiledEntities');

  it('Grid is available', () => s.grid.getGrid());

  it('Negative: Locate header item by invalid name: xxx', async () => {
    const items = await s.grid.getHeaderItemsOrder();
    expect(Object.values(items).indexOf('xxx')).toEqual(-1);
  });

  it('Positive: Locate header item by valid name: Name', async () => {
    const items = await s.grid.getHeaderItemsOrder();
    expect(Object.values(items).indexOf('Name')).toBeGreaterThan(-1);
  });

  it('Show item data', async () => {
    const $cell = await s.grid.getDataRow(0, 'Name');

    const name = await $cell.getText();
    await s.browser.doubleClick($cell);
    const $page = await s.selectors.pageContainer();
    const $input = await s.selectors.inputName($page);
    const value = await $input.getAttribute('value');
    expect(value).toEqual(name);
  });
});
