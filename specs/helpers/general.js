/**
 * @export navigateTo
 * @param url
 * @param title
 * @param isSpec
 */
export const navigateTo = (url, title, isSpec = true) => {
  isSpec ? it(`Navigate to: ${url}`, async () => s.browser.matchTitle(url, title)) :
      s.browser.matchTitle(url, title);
};