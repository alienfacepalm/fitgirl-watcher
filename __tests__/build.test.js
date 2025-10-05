const mockFs = require('mock-fs');
const path = require('path');

describe('Build script', () => {
  let UniversalBuilder;
  beforeEach(() => {
    mockFs({
      [path.join(process.cwd(), 'dist')]: {},
      [path.join(process.cwd(), 'scripts')]: mockFs.load(path.join(process.cwd(), 'scripts')),
    });
    jest.resetModules();
    UniversalBuilder = require('../scripts/build.js');
  });

  afterEach(() => {
    mockFs.restore();
  });

  test('showHelp prints help text', () => {
    const builder = new UniversalBuilder();
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    builder.showHelp();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});


