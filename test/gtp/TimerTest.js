describe('Timer', function() {
   'use strict';
   
   var debugContent,
       errorContent;
   
   beforeEach(function() {
      
      debugContent = '';
      errorContent = '';
      
      // Note we are assuming that console.log/error are called with 1 argument
      // here...
      spyOn(console, 'log')
            .and.callFake(function(arg) {
               debugContent += arg + '\n';
            });
      spyOn(console, 'error')
            .and.callFake(function(arg) {
               errorContent += arg + '\n';
            });
   });
   
   it('logging, happy path, single event', function() {
      
      var timer = new gtp.Timer();
      
      timer.start('work');
      timer.endAndLog('work');
      
      expect(debugContent).toMatch(/^DEBUG: work: [\d.]+ ms/);
   });
   
   it('logging, unknown key passed to endAndLog', function() {
      
      var timer = new gtp.Timer();
      
      timer.start('work');
      timer.endAndLog('twerk');
      
      expect(debugContent).toBe('');
      expect(errorContent).toBe('Cannot end timer for "twerk" as it was never started\n');
   });
   
   it('setLogPrefix, new value', function() {
      
      var timer = new gtp.Timer();
      timer.setLogPrefix('TEST');
      
      timer.start('work');
      timer.endAndLog('work');
      
      expect(debugContent).toMatch(/^TEST: work: [\d.]+ ms/);
   });
   
   it('setLogPrefix, resetting to default', function() {
      
      var timer = new gtp.Timer();
      timer.setLogPrefix('TEST');
      
      timer.start('work');
      timer.endAndLog('work');
      
      expect(debugContent).toMatch(/^TEST: work: [\d.]+ ms/);
      
      timer.setLogPrefix(); // Should reset
      
      timer.start('work2');
      timer.endAndLog('work2');
      
      expect(debugContent).toMatch(/^TEST: work: [\d.]+ ms\nDEBUG: work2: [\d.]+ ms/);
   });

});