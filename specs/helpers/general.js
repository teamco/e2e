import {browser} from 'protractor';

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

/**
 * @export disableAngular
 * @param disable
 */
export const disableAngular = (disable = true) => {
  it(`Disable Synchronization: ${disable}`, async () => {
    await s.browser.synchronization(!disable);
    expect(browser.ignoreSynchronization).toBeTruthy();
  });
};