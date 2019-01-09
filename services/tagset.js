/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * Created by yurygo on 6/10/2018.
 */

const
  TAGSET = '._t_tagSet',
  TAGSET_TAG = '._t_tag',
  TAGSET_APPENDER = '._t_appender',
  TAGSET_INPUT = '.ant-input';

/**
 * Tagset
 * @constructor
 */
const Tagset = function() {

  /**
   * getTagset
   * @method Tagset.getTagset
   * @property Tagset
   * @param {string} [customSelector] - custom tagset class with dot (e.g. "._t_MyTagset")
   * @param {string} [type]
   */
  this.getTagset =
    async (customSelector, type) => s.e2e.getElementBy('css', `${(customSelector || '').trim()}${TAGSET}`, type);

  /**
   * getTagsetInsideOf
   * @method Tagset.getTagsetInsideOf
   * @property Tagset
   * @param $locator
   * @param {string} [customSelector] - custom tagset class with dot (e.g. "._t_MyTagset")
   * @param {string} [type]
   */
  this.getTagsetInsideOf =
    async ($locator, customSelector, type) => s.e2e.getElementInsideOfBy(`${(customSelector || '').trim()}${TAGSET}`,
      $locator, type);

  /**
   * getTags
   * @method Tagset.getTags
   * @property Tagset
   * @param $locator
   * @param {string} [customSelector] - custom tagset class with dot (e.g. "._t_MyTag")
   */
  this.getTags =
    async ($locator, customSelector) => s.e2e.getElementsInsideOfBy(`${(customSelector || '').trim()}${TAGSET_TAG}`,
      $locator);

  /**
   * getAppender
   * @method Tagset.getAppender
   * @property Tagset
   * @param $locator
   * @param {string} [type]
   */
  this.getAppender =
    async ($locator, type) => s.e2e.getElementInsideOfBy(TAGSET_APPENDER, $locator, type);

  /**
   * getAppender
   * @method Tagset.getAppender
   * @property Tagset
   * @param $tagSet
   * @param newValue
   */
  this.appendTag =
    async ($tagSet, newValue) => {
      const $appender = await this.getAppender($tagSet, 'Clickable');
      const $inputs = await s.e2e.getElementsInsideOfBy(TAGSET_INPUT, $appender);
      let $input;
      if (!$inputs.length) {
        await s.e2e.button.press($appender);
        $input = await s.e2e.getElementInsideOfBy(TAGSET_INPUT, $appender);
      } else {
        $input = $inputs[0];
      }
      const $tagsBefore = await s.e2e.getElementsInsideOfBy(TAGSET_TAG, $tagSet);
      await s.e2e.input.setValue($input, newValue);
      await $input.sendKeys(s.e2e.Key.ENTER);
      const $tagsAfter = await s.e2e.getElementsInsideOfBy(TAGSET_TAG, $tagSet);
      expect($tagsAfter.length - $tagsBefore.length).toBe(1);
    };

};

module.exports = new Tagset();
