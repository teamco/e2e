/**
 * @name helper
 * @author tkachv
 * @date 1/16/2019
 * @time 2:57 PM
 */

/**
 * @export navigateTo
 * @param url
 * @param title
 */
export const navigateTo = (url, title) => {
  it(`Navigate to: ${url}`, async () => {
    await s.browser.validateTitle(url, title);
  });
};

/**
 * @export setLanguage
 * @param lang
 */
export const setLanguage = lang => {
  it(`Change language to: ${lang}`, async () => {
    const $lang = await s.getElementByText('a', lang, 'Clickable');
    await s.button.press($lang);
  });
};

/**
 * @export searchFor
 * @param {string} text
 */
export const searchFor = text => {
  it(`Search for: ${text}`, async () => {
    const $input = s.getElementBy('css', 'input[aria-label="Search"]');
    await s.input.updateValue($input, text);
  });
};

/**
 * @export doSearch
 */
export const doSearch = () => {
  it(`Do search`, async () => {
    const $submits = await s.getElementsBy('css', 'input[aria-label="Google Search"]');
    await s.waitForClickable($submits[0]);
    await s.button.press($submits[0]);
  });
};