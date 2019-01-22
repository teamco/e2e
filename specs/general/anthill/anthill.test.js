import {doSearch, navigateTo, searchFor, setLanguage} from './helper';

const services = require('../../../services/main');
global.s = services.e2e;

describe('AntHill', () => {

  global.s.preConfig({
    beforeAll() {
      // TODO (Tkachv): Do something
    },
    beforeEach() {
      // TODO (Tkachv): Do something
    },
    afterAll() {
      // TODO (Tkachv): Do something
    },
    afterEach() {
      // TODO (Tkachv): Do something
    }
  });

  navigateTo('http://localhost:5000/sites/shared/development', 'Anthill');
});