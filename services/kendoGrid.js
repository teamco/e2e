/**
 * Created by tkachv on 5/15/2017.
 */

/**
 * Define e2e
 * @type {{e2e: Object}}
 */
const s = require('./main.js');

/**
 * Button
 * @constructor
 */
const KendoGrid = function() {
  /**
   * @constant ELEMENT_CLASSES
   * @type {{HOVER: string, SELECTED: string}}
   */
  const ELEMENT_CLASSES = {
    HOVER: 'ag-row-hover',
    SELECTED: 'ag-row-selected'
  };

  /**
   * @method Grid.cleanFilter
   * @property Grid
   */
  this.cleanFilter = () => {
    s.e2e.input.verifyValue(s.e2e.selectors.filter());
    this.doFilter();
  };

  /**
   * @method Grid.doFilter
   * @property Grid
   */
  this.doFilter = () => s.e2e.selectors.filterButton().then($searchBtn => s.e2e.button.press($searchBtn));

  /**
   * @method Grid.getGrid
   * @property Grid
   * @param {string} [css]
   * @returns {promise.Promise<R>|*}
   */
  this.getGrid = async css => {
    await s.e2e.waitForLocalLoader();
    return await this.getTable(css);
  };

  /**
   * @method Grid.getHeaderItemsOrder
   * @property Grid
   * @param $items
   */
  this.getHeaderItemsOrder = async $items => {
    let items = {};
    if (!$items) {
      $items = await this.getHeaderItems();
    }
    for (let i = 0; i < $items.length; i++) {
      const $cell = $items[i];
      items[i] = await $cell.getText();
    }

    return items;
  };

  /**
   * @method Grid.getHeaderVisibleItems
   * @property Grid
   * @returns {Array}
   */
  this.getHeaderVisibleItems = async (css) => {
    const headerItems = await this.getHeaderItems(css);
    return headerItems.map($header => s.e2e.waitForDisplayed($header));
  };

  /**
   * @method Grid.getHeaderVisibleItems
   * @property Grid
   * @returns {Array}
   */
  this.getHeaderItems = async (css) => {
    const $grid = await this.getGrid(css);
    return await this.tableHeaderItems($grid);
  };

  /**
   * @method Grid.getDataRow
   * @param {number} index
   * @param {string} name
   * @returns {promise.Promise<T> | promise.Promise<any>}
   */
  this.getDataRow = async (index, name) => {
    const $grid = await this.getGrid();
    const $row = await this.tableRow($grid, index);
    await s.e2e.waitForDisplayed($row);
    const items = await this.getHeaderItemsOrder();

    const cellIndex = Object.keys(items).map(i => items[i]).indexOf(name);
    const $cell = await this.getRowCell($row, cellIndex);
    return await s.e2e.waitForDisplayed($cell);
  };

  /**
   * table
   * @property Selectors
   * @method Selectors.getTable
   * @param {string} [css]
   * @returns {!Thenable.<T>|!(promise.Thenable.<T>|WebElementPromise)|*}
   */
  this.getTable = css => s.e2e.getElementBy('css', css || 'div[class*="table"]');

  /**
   * tableHeaderItems
   * @property Selectors
   * @method Selectors.tableHeaderItems
   * @param {WebElement} $table
   * @returns {*}
   */
  this.tableHeaderItems = $table => s.e2e.getElementsInsideOfBy('.k-header', $table);

  /**
   * tableRows
   * @property Selectors
   * @method Selectors.tableRows
   * @param {WebElement} $table
   * @returns {ElementArrayFinder}
   */
  this.tableRows = $table => s.e2e.getElementsInsideOfBy('.k-master-row', $table);

  /**
   * tableRows
   * @property Selectors
   * @method Selectors.tableRows
   * @param {WebElement} $table
   * @param {number} [index]
   * @returns {ElementArrayFinder}
   */
  this.tableRow = async ($table, index) => {
    const $rows = await this.tableRows($table);
    expect($rows.length - 1 >= index).toBeTruthy();
    return $rows[index];
  };

  /**
   * tableCells
   * @property Selectors
   * @method Selectors.tableCells
   * @param {WebElement} $row
   * @returns {ElementArrayFinder}
   */
  this.tableCells = $row => s.e2e.getElementsInsideOfBy('[role="gridcell"]', $row);

  /**
   * @property Grid
   * @method Selectors.getRowCell
   * @param $row
   * @param index
   * @returns {promise.Promise<any>}
   */
  this.getRowCell = async ($row, index) => {
    const $cells = await this.tableCells($row);
    expect($cells.length - 1 >= index).toBeTruthy();
    return $cells[index];
  };
  /**
   *
   * @param {Number} rowIndex
   * @param {String|Number} colId
   * @param {ElementFinder} $grid
   * @returns {Promise<ElementFinder>}
   */
  this.getCellByRowIndexAndColId = async (rowIndex, colId, $grid) => {
    const searchString = 'div[row-index="' + rowIndex + '"] div[col-id="' + colId + '"]';
    return (await s.e2e.getElementsInsideOfBy(searchString, $grid))[0];
  };

  /**
   * @property Grid
   * @method Grid.getGridCell
   * @param rowIndex
   * @param colIndex
   * @returns {promise.Promise<any>}
   */
  this.getGridCell = async (rowIndex, colIndex, $grid) => {
    if (!$grid) {
      $grid = await this.getGrid();
    }
    const $row = await this.tableRow($grid, rowIndex);
    return await this.getRowCell($row, colIndex);
  };

  /**
   * @method gridColumnSorting
   * @property Grid.gridColumnSorting
   * @param {number} fromColumn
   * @param {number} toColumn
   * @param {number} rowIndex
   * @returns {Promise<void>}
   */
  this.gridColumnSorting = async (fromColumn, toColumn, rowIndex) => {
    // Get Table Headers
    const $headerItems = await this.getHeaderItems();
    const $headerCell_1_1 = $headerItems[fromColumn];
    await s.e2e.waitForDisplayed($headerCell_1_1);
    // Get cell text
    const headerText_1_1 = await $headerCell_1_1.getText();
    // Get cell left
    const headerLeft_1_1 = await s.e2e.getElementStyleParameter($headerCell_1_1, 'left');

    const $headerCell_2_1 = $headerItems[toColumn];
    await s.e2e.waitForDisplayed($headerCell_2_1);
    // Get cell text
    const headerText_2_1 = await $headerCell_2_1.getText();
    // Get cell left
    const headerLeft_2_1 = await s.e2e.getElementStyleParameter($headerCell_2_1, 'left');

    // Get Data cell
    const $cell_1 = await this.getGridCell(rowIndex, fromColumn);
    await s.e2e.waitForDisplayed($cell_1);
    // Get cell text
    const cell_1_text = await $cell_1.getText();
    const cell_1_left = await s.e2e.getElementStyleParameter($cell_1, 'left');

    await s.e2e.browser.mouseDown($headerCell_1_1);
    await s.e2e.browser.mouseMove($headerCell_2_1);
    await s.e2e.browser.mouseUp(true);

    // Get headers after move
    const $headerItems2 = await this.getHeaderItems();
    // Get first header cell after move
    const $headerCell_1_2 = $headerItems2[fromColumn];
    await s.e2e.waitForDisplayed($headerCell_1_2);
    // Get cell text
    const headerText_1_2 = await $headerCell_1_2.getText();
    // Get cell left
    const headerLeft_1_2 = await s.e2e.getElementStyleParameter($headerCell_1_2, 'left');

    // Check Header text has not changed
    expect(headerText_1_1).toEqual(headerText_1_2);

    // Get second header cell after move
    const $headerCell_2_2 = $headerItems2[toColumn];
    await s.e2e.waitForDisplayed($headerCell_2_2);
    // Get cell text
    const headerText_2_2 = await $headerCell_2_2.getText();
    // Get cell left
    const headerLeft_2_2 = await s.e2e.getElementStyleParameter($headerCell_2_2, 'left');

    // Check Header text has not changed
    expect(headerText_2_1).toEqual(headerText_2_2);

    // Get Data cell
    const $cell_2 = await this.getGridCell(rowIndex, fromColumn);
    await s.e2e.waitForDisplayed($cell_2);
    // Get cell text
    const cell_2_text = await $cell_2.getText();
    const cell_2_left = await s.e2e.getElementStyleParameter($cell_2, 'left');

    expect(cell_1_text).toEqual(cell_2_text);
    expect(cell_1_left).toEqual(headerLeft_1_1);
    expect(cell_2_left).toEqual(headerLeft_1_2);

    expect(headerLeft_1_1).toEqual(headerLeft_2_2);
    expect(headerLeft_2_1).toEqual(headerLeft_1_2);
  };

  /**
   * @method changeClassOnHover
   * @property Grid.changeClassOnHover
   * @param {number} rowFrom
   * @param {number} rowTo
   * @returns {Promise<void>}
   */
  this.changeClassOnHover = async (rowFrom, rowTo) => {
    const $grid = await this.getGrid();
    const $row = await this.tableRow($grid, rowFrom);
    // check row is not hovered
    await s.e2e.shouldMatchToClassName($row, ELEMENT_CLASSES.HOVER, false);

    await s.e2e.browser.mouseMove($row);

    // check row is hovered
    //await s.e2e.shouldMatchToClassName($row, ELEMENT_CLASSES.HOVER, true);

    const $otherRow = await this.tableRow($grid, rowTo);
    await s.e2e.browser.mouseMove($otherRow);

    // check other row is hovered
    await s.e2e.shouldMatchToClassName($otherRow, ELEMENT_CLASSES.HOVER, true);
    // check row is not hovered
    await s.e2e.shouldMatchToClassName($row, ELEMENT_CLASSES.HOVER, false);
  };

  /**
   * @method changeClassOnSelect
   * @property Grid.changeClassOnSelect
   * @param {number} rowFrom
   * @param {number} rowTo
   * @returns {Promise<void>}
   */
  this.changeClassOnSelect = async (rowFrom, rowTo) => {
    const $grid = await this.getGrid();
    const $row = await this.tableRow($grid, rowFrom);
    // check current row is not selected, hovered
    await s.e2e.shouldMatchToClassName($row, ELEMENT_CLASSES.HOVER, false);
    await s.e2e.shouldMatchToClassName($row, ELEMENT_CLASSES.SELECTED, false);

    await s.e2e.browser.clickOnElement($row);

    // check current row is selected, hovered
    await s.e2e.shouldMatchToClassName($row, ELEMENT_CLASSES.HOVER, true);
    await s.e2e.shouldMatchToClassName($row, ELEMENT_CLASSES.SELECTED, true);

    const $otherRow = await this.tableRow($grid, rowTo);

    await s.e2e.browser.clickOnElement($otherRow);

    // check row is not selected, hovered
    await s.e2e.shouldMatchToClassName($row, ELEMENT_CLASSES.SELECTED, false);
    await s.e2e.shouldMatchToClassName($row, ELEMENT_CLASSES.HOVER, false);
    // check other row is selected, hovered
    await s.e2e.shouldMatchToClassName($otherRow, ELEMENT_CLASSES.HOVER, true);
    await s.e2e.shouldMatchToClassName($otherRow, ELEMENT_CLASSES.SELECTED, true);
  };
};

module.exports = new KendoGrid();
