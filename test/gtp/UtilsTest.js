describe('Utils', function() {
   'use strict';
   
   it('constructor happy path, even though not used', function() {
      var utils = new gtp.Utils();
      expect(utils).not.toBeNull();
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
});
