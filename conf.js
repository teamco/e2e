/**
 * Created by teamco on 3/22/2017.
 */

/*jshint esversion: 6 */

/**
 * @const protocol
 * @type {string}
 */
const protocol = 'http';

/**
 * Remote host
 * @constant remoteHost
 * @type {string}
 */
const remoteHost = 'localhost';

/**
 * @constant localHost
 * @type {string}
 */
const localHost = 'localhost';

/**
 * @constant port
 * @type {number}
 */
const port = 9333;

/**
 * @constant targetPath
 * @type {string}
 */
const targetPath = remoteHost === localHost ? '' : '';

/**
 * Base url
 * @constant baseUrl
 * @type {string}
 */
const baseUrl = protocol + '://' + remoteHost + ':' + port + targetPath;

//npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver
const PrettyReporter = require('protractor-pretty-html-reporter').Reporter;

const path = require('path');
const fs = require('fs');

/**
 * @method _updateConfig
 * @param config
 * @param param
 * @param value
 * @returns {*}
 * @private
 */
function _updateConfig(config, param, value) {
  switch (param) {
    case 'specs':
      config.specs = [];
      // generate specs array
      (value || '').split(/\|/g).forEach(dir => config.specs.push(dir.endsWith('.js') ? dir : path.join(dir, '*.js')));
      console.log('>>> Execute specs', config.specs);
      break;
    case 'browser':
      if (value) {
        config.capabilities.browserName = value;
        if (value.toLowerCase() === 'ie') {
          config.capabilities.browserName = 'internet explorer';
          config.capabilities.platform = 'ANY';
          config.capabilities.version = '11';
          config.seleniumArgs =
            ['-Dwebdriver.ie.driver=' + path.join('node_modules', 'protractor', 'selenium', 'IEDriverServer.exe')];
        }
        if (value !== 'chrome' && value !== 'firefox') {
          config.directConnect = false;
        }
      }
      break;
    case 'timeout':
      if (value) {
        config.jasmineNodeOpts.defaultTimeoutInterval = parseInt(value, 10);
      }
      break;
    case 'threads':
      if (value) {
        config.capabilities.maxInstances = parseInt(value, 10);
        config.capabilities.shardTestFiles = config.capabilities.maxInstances > 1;
      }
      break;
    case 'headless':
      const browser = config.capabilities.browserName;
      const headless = config.params.headless;
      if (value === 'true' && headless && Array.isArray((headless[browser] || {}).args)) {
        if (browser === 'chrome') {
          config.capabilities.chromeOptions.args =
            config.capabilities.chromeOptions.args.concat(headless[browser].args);
        } else if (browser === 'firefox') {
          config.capabilities['moz:firefoxOptions'].args =
            config.capabilities['moz:firefoxOptions'].args.concat(headless[browser].args);
        }
      }
      break;
    case 'url':
      if (value) {
        config.baseUrl = value;
      }
      break;
    case 'custom_args':
      if (value) {
        try {
          config.params.custom_args = JSON.parse(value);
        } catch (e) {
          console.log('Unable to parse args:', value);
          console.error(e);
        }
      }
      break;
    default:
      // TODO (teamco): Do something
      break;
  }
  return config;
}

/**
 * @method init
 * @example
 * // npm run e2e -- --params.specs=* --params.browser=ie --params.threads=1
 * // npm run e2e -- --params.specs=dir1|dir2
 * // npm run e2e -- --params.specs=dir1|dir2/spec1.js|dir2/spec2.js
 * // npm run e2e -- --params.headless=true --params.threads=1
 * @param config
 * @returns {*}
 */
const init = config => {
  for (let i = 3; i < process.argv.length; i++) {
    const match = process.argv[i].match(/^--params\.([^=]+)=(.*)$/);
    if (match) {
      const param = match[1];
      const value = match[2];
      _updateConfig(config, param, value);
    }
  }
  for (let index in process.env) {
    if (process.env.hasOwnProperty(index)) {
      _updateConfig(config, index, process.env[index]);
    }
  }
  return config;
};

/**
 * @constant config
 * @type {{
 *  params: {headless: string[]}, specs: string[],
 *  allScriptsTimeout: number,
 *  seleniumAddress: string,
 *  directConnect: boolean,
 *  rootElement: string,
 *  baseUrl: string,
 *  framework: string,
 *  jasmineNodeOpts: {showColors: boolean, defaultTimeoutInterval: number},
 *  capabilities: {
 *    browserName: string,
 *    chromeOptions: {
 *      prefs: {credentials_enable_service: boolean, profile: {password_manager_enabled: boolean}},
 *      args: string[]
 *    },
 *    shardTestFiles: boolean,
 *    maxInstances: number
 *   },
  *  onPrepare: function(),
  *  beforeLaunch: function(): void
  * }}
 */
const config = {
  params: {
    headless: {
      chrome: {
        args: [
          '--headless',
          '--disable-gpu',
          '--window-size=800,600',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222'
        ]
      },
      firefox: {
        args: ['--headless']
      }
    }
  },
  specs: ['specs/spec.js'],
  allScriptsTimeout: 720000,
  seleniumAddress: 'http://localhost:4444/wd/hub',
  //directConnect: true,
  rootElement: 'html',
  baseUrl: baseUrl,
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 300000 // 5 min
  },
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      prefs: {
        'credentials_enable_service': false,
        'profile': {
          'password_manager_enabled': false
        }
      },
      args: [
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0',
        '--v8-cache-options=off'
      ]
    },
    shardTestFiles: false,
    maxInstances: 1
  },
  onPrepare: () => {
    require('babel-register');
    require('babel-core/register')({presets: ['env']});
    jasmine.getEnv().addReporter(prettyReporter);
    // s.e2e.browser.disableSynchronization();
  },
  beforeLaunch: () => prettyReporter.startReporter()
};

let prettyReporter;

/**
 * Init protractor configuration
 * @export config
 */
exports.config = (() => {
  const result = init(config);

  // Get browser name
  const browserName = result.capabilities.browserName;
  const dirs = ['results', browserName, Date.now()];
  let dirPath = path.join(__dirname, '');

  // Define reporter folder structure
  dirs.forEach(dir => {
    dirPath = path.join(dirPath, '' + dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });

  /**
   * Init jasmine reporter
   */
  prettyReporter = new PrettyReporter({
    path: dirPath,
    screenshotOnPassed: true
  });

  return result;
})();
