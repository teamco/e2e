import {doSearch, navigateTo, searchFor, setLanguage} from './helper';

const services = require('../../../services/main');
global.s = services.e2e;

describe('Google search', () => {

  global.s.preConfig({
    beforeAll() {
      // TODO (Tkachv): Dom something
    },
    beforeEach() {
      // TODO (Tkachv): Dom something
    },
    afterAll() {
      // TODO (Tkachv): Dom something
    },
    afterEach() {
      // TODO (Tkachv): Dom something
    }
  });

  navigateTo('https://www.google.com', 'Google');
  setLanguage('English');
  searchFor('ReactJS');
  doSearch();
});