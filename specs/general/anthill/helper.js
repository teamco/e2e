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
  it(`Navigate to: ${url}`, async () => s.browser.matchTitle(url, title));
};