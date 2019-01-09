/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * @class Upload
 */
class Upload {

  /**
   * @method getInputFile
   * @property Upload
   * @param {string} [css]
   */
  async getInputFile(css) {
    return await s.e2e.getElementBy('css', css || 'input[type="file"]');
  }

  /**
   * @method getUploadAbsolutePath
   * @property Upload
   * @param {string} fileToUpload
   * @returns {string}
   */
  getUploadAbsolutePath(fileToUpload) {

    /**
     * The path module provides utilities for working with file and directory paths.
     * @type {"path"}
     * @constant path
     */
    const path = require('path');
    return path.resolve(__dirname, fileToUpload);
  }

  /**
   * @method unHideInput
   * @property Upload
   * @param {ElementFinder} $locator
   */
  async unHideInput($locator) {
    await browser.executeScript(
      'var style=arguments[0].style;style.display="initial";style.visibility="visible";style.height="1px";style.width="1px";style.opacity=1;',
      $locator.getWebElement());
  }

  /**
   * Upload file simulation
   * @method doUpload
   * @property Upload
   * @param {string} path
   * @param {ElementFinder} [$triggerOn] Upload button.
   */
  async doUpload(path, $triggerOn) {
    s.e2e.browser.setFileDetector();
    const absolutePath = this.getUploadAbsolutePath(path);
    const $file = await this.getInputFile();
    await this.unHideInput($file);
    $file.sendKeys(absolutePath);
    // take a breath
    s.e2e.browser.wait(100);

    if ($triggerOn) {
      // click upload button
      $triggerOn.click();
    }
  }
}

module.exports = new Upload();
