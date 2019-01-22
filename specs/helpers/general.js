/**
 * @export navigateTo
 * @param url
 * @param title
 */
export const navigateTo = (url, title) => {
  it(`Navigate to: ${url}`, async () => s.browser.matchTitle(url, title));
};