/**
 * aia-ui-frontend
 * @name collapse
 * @author alexache
 * @date 5/1/2018
 * @time 12:42 PM
 */

/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * Collapse
 * @constructor
 */
const Collapse = function() {
  /**
   * @method Collapse.getCollapse
   * @property Collapse
   * @param {string} [css]
   * @returns {promise.Promise<R>|*}
   */
  this.getCollapse = async css => {
    return await s.e2e.getElementBy('css', css || 'div[class*="ant-collapse"]');
  };

  /**
   * @method Collapse.getPanel
   * @property Collapse
   * @param {string} [css]
   * @returns {Promise<void>}
   */
  this.getPanel = async css => {
    return await s.e2e.getElementBy('css', css || 'div[class*="ant-collapse-item"]');
  };

  /**
   * @method Collapse.getPanelHeader
   * @property Collapse
   * @param {ElementFinder} $panel
   * @returns {Promise<void>}
   */
  this.getPanelHeader = async $panel => {
    return (await s.e2e.getElementsInsideOfBy('.ant-collapse-header', $panel))[0];
  };

  /**
   * @method Collapse.getPanelContent
   * @property Collapse
   * @param {ElementFinder} $panel
   * @returns {Promise<void>}
   */
  this.getPanelContent = async $panel => {
    return (await s.e2e.getElementsInsideOfBy('.ant-collapse-content', $panel))[0];
  };

  /**
   * @method Collapse.isPanelExpanded
   * @property Collapse
   * @param {ElementFinder} $panel
   * @returns {Promise<boolean>}
   */
  this.isPanelExpanded = async $panel => {
    return await s.e2e.hasClassName($panel, 'ant-collapse-item-active');
  };

  /**
   * @method Collapse.isPanelHeaderExpanded
   * @property Collapse
   * @param {ElementFinder} $panelHeader
   * @returns {Promise<boolean>}
   */

  this.isPanelHeaderExpanded = async $panelHeader => {
    return (await $panelHeader.getAttribute('aria-expanded')) === 'true';
  };

  /**
   * @method Collapse.isPanelContentExpanded
   * @property Collapse
   * @param {ElementFinder} $panelContent
   * @returns {Promise<boolean>}
   */
  this.isPanelContentExpanded = async $panelContent => {
    return await s.e2e.hasClassName($panelContent, 'ant-collapse-content-active');
  };

  /**
   * @method Collapse.verifyExpandCollapsePanel
   * @property Collapse
   * @param $panel
   * @returns {Promise<void>}
   */
  this.verifyExpandCollapsePanel = async $panel => {
    const isPanelExpanded = await this.isPanelExpanded($panel);

    const $panelHeader = await this.getPanelHeader($panel);
    const isHeaderExpanded = await this.isPanelHeaderExpanded($panelHeader);

    let $panelContent = isPanelExpanded ? await this.getPanelContent($panel) : undefined;
    const isContentExpanded = isPanelExpanded ? await this.isPanelContentExpanded($panelContent) : false;

    // Verify all elements' initial state
    expect(isPanelExpanded).toEqual(isHeaderExpanded);
    expect(isPanelExpanded).toEqual(isContentExpanded);

    await s.e2e.button.press($panelHeader);

    // Verify all elements state changed
    const isPanelExpandedAfterClick = await this.isPanelExpanded($panel);
    const isHeaderExpandedAfterClick = await this.isPanelHeaderExpanded($panelHeader);
    if (isPanelExpandedAfterClick) {
      $panelContent = await this.getPanelContent($panel);
    }
    const isContentExpandedAfterClick = $panelContent ? await this.isPanelContentExpanded($panelContent) : false;
    expect(isPanelExpandedAfterClick).not.toEqual(isPanelExpanded);
    expect(isHeaderExpandedAfterClick).not.toEqual(isHeaderExpanded);
    expect(isContentExpandedAfterClick).not.toEqual(isContentExpanded);

    await s.e2e.button.press($panelHeader);

    // Verify all elements' state back to initial
    const isPanelExpandedAfterSecondClick = await this.isPanelExpanded($panel);
    const isHeaderExpandedAfterSecondClick = await this.isPanelHeaderExpanded($panelHeader);
    const isContentExpandedAfterSecondClick = await this.isPanelContentExpanded($panelContent);
    expect(isPanelExpandedAfterSecondClick).toEqual(isPanelExpanded);
    expect(isHeaderExpandedAfterSecondClick).toEqual(isHeaderExpanded);
    expect(isContentExpandedAfterSecondClick).toEqual(isHeaderExpanded);
  };

  /**
   * @method Collapse.togglePanel
   * @property Collapse
   * @param {ElementFinder} $panel
   * @param {Boolean} expand
   * @returns {Promise<void>}
   */
  this.togglePanel = async ($panel, expand) => {
    const isPanelExpanded = await this.isPanelExpanded($panel);
    if (isPanelExpanded && expand) {
      // Panel is already expanded
      return;
    }
    if (!isPanelExpanded && expand === false) {
      // Panel is already collapsed
      return;
    }
    const $panelHeader = await this.getPanelHeader($panel);
    await s.e2e.button.press($panelHeader);

    const isPanelExpandedAfterClick = await this.isPanelExpanded($panel);
    expect(isPanelExpandedAfterClick).not.toEqual(isPanelExpanded);
  };
};

module.exports = new Collapse();
