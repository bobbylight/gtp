describe('Utils', function() {
   'use strict';

   it('constructor happy path, even though not used', function() {
      var utils = new gtp.Utils();
      expect(utils).not.toBeNull();
   });

   it('getObjectSize() happy path', function() {

     var obj = { };
     expect(gtp.Utils.getObjectSize(obj)).toBe(0);

     obj = { one: 1, two: 2 };
     expect(gtp.Utils.getObjectSize(obj)).toBe(2);
   });

   it('getRequestParam() param found, no values, multiple params', function() {

      spyOn(gtp.BrowserUtil, 'getWindowLocationSearch')
            .and.returnValue('?foo&bar&bas');

      expect(gtp.Utils.getRequestParam('foo')).toBe('');
      expect(gtp.Utils.getRequestParam('bar')).toBe('');
      expect(gtp.Utils.getRequestParam('bas')).toBe('');
   });

   it('getRequestParam() param found, values, multiple params', function() {

      spyOn(gtp.BrowserUtil, 'getWindowLocationSearch')
            .and.returnValue('?foo=fooValue&bar=barValue&bas=basValue');

      expect(gtp.Utils.getRequestParam('foo')).toBe('fooValue');
      expect(gtp.Utils.getRequestParam('bar')).toBe('barValue');
      expect(gtp.Utils.getRequestParam('bas')).toBe('basValue');
   });

   it('getRequestParam() param not found', function() {

      spyOn(gtp.BrowserUtil, 'getWindowLocationSearch')
            .and.returnValue('?foo=fooValue&bar=barValue&bas=basValue');

      expect(gtp.Utils.getRequestParam('notFound')).toBeNull();
   });

   it('getRequestParam() param not found, substring of param', function() {

      spyOn(gtp.BrowserUtil, 'getWindowLocationSearch')
            .and.returnValue('?debugMode=true');

      expect(gtp.Utils.getRequestParam('debug')).toBeNull();
   });

   it('randomInt(), max only', function() {

     expect(gtp.Utils.randomInt(1)).toBe(0);

     var result = gtp.Utils.randomInt(5);
     expect(result >= 0).toBeTruthy();
     expect(result).toBeLessThan(5);
   });

  it('randomInt(), min and max', function() {

    var result = gtp.Utils.randomInt(0, 1);
    expect(result).toBe(0);

    result = gtp.Utils.randomInt(0, 5);
    expect(result >= 0).toBeTruthy();
    expect(result).toBeLessThan(5);

    result = gtp.Utils.randomInt(100, 150);
    expect(result >= 100).toBeTruthy();
    expect(result).toBeLessThan(150);
  });

   it('timestamp()', function() {

     var DELAY = 100;

     var start = gtp.Utils.timestamp();
     var waitUntil = Date.now() + DELAY + 1; // Wait > 100 milliseconds
     while (Date.now() < waitUntil);
     var end = gtp.Utils.timestamp();
     expect(end).toBeGreaterThan(start + DELAY);
   });

   it('initConsole() with console defined', function() {
     var mockConsole = {
       info: 1,
       log: 2,
       warn: 3,
       'error': 4
     };
     window.console = mockConsole;
     gtp.Utils.initConsole();
     expect(window.console).toBe(mockConsole);
   });

    it('initConsole() with console undefined', function() {
      var origConsole = window.console;
      window.console = null;
      gtp.Utils.initConsole();
      expect(window.console).not.toBeNull();
      window.console = origConsole;
    });
});
