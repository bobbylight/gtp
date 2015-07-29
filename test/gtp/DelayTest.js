describe('Delay', function() {
   'use strict';
   
   it('constructor happy path', function() {
      
      var delay = new gtp.Delay({ millis: 100 });
      expect(delay.isDone()).toEqual(false);
      delay.update(50);
      expect(delay.isDone()).toEqual(false);
      delay.update(49);
      expect(delay.isDone()).toEqual(false);
      delay.update(1);
      expect(delay.isDone()).toEqual(true);
      
   });
   
   it('constructor with millis not specified', function() {
      expect(function() { new gtp.Delay(); }).toThrow();
      expect(function() { new gtp.Delay({}); }).toThrow();
   });
   
   it('update()', function() {
      
      // Calling update() with various millis passed until done.
      var delay = new gtp.Delay({ millis: 100 });
      expect(delay.isDone()).toEqual(false);
      delay.update(50);
      expect(delay.isDone()).toEqual(false);
      delay.update(49);
      expect(delay.isDone()).toEqual(false);
      delay.update(1);
      expect(delay.isDone()).toEqual(true);
      
   });
   
   it('getLoopCount()', function() {
      
      // Looping not enabled => getLoopCount() always returns 0
      var delay = new gtp.Delay({ millis: 100 });
      expect(delay.getLoopCount()).toEqual(0);
      delay.update(100);
      expect(delay.isDone()).toEqual(true);
      expect(delay.getLoopCount()).toEqual(0);
      
      // Infinite looping => getLoopCount() updates on interval
      delay = new gtp.Delay({ millis: 100, loop: true });
      expect(delay.getLoopCount()).toEqual(0);
      delay.update(100);
      expect(delay.isDone()).toEqual(false);
      expect(delay.getLoopCount()).toEqual(1);
      delay.update(50);
      expect(delay.isDone()).toEqual(false);
      expect(delay.getLoopCount()).toEqual(1);
      delay.update(50);
      expect(delay.isDone()).toEqual(false);
      expect(delay.getLoopCount()).toEqual(2);
      
      // Fixed loop count => getLoopCount() increments to that number
      delay = new gtp.Delay({ millis: 100, loop: true, loopCount: 3 });
      expect(delay.isDone()).toEqual(false);
      expect(delay.getLoopCount()).toEqual(0);
      delay.update(100);
      expect(delay.isDone()).toEqual(false);
      expect(delay.getLoopCount()).toEqual(1);
      delay.update(50);
      expect(delay.isDone()).toEqual(false);
      expect(delay.getLoopCount()).toEqual(1);
      delay.update(50);
      expect(delay.isDone()).toEqual(false);
      expect(delay.getLoopCount()).toEqual(2);
      delay.update(100);
      expect(delay.isDone()).toEqual(true);
      expect(delay.getLoopCount()).toEqual(3);
      delay.update(100);
      expect(delay.isDone()).toEqual(true);
      expect(delay.getLoopCount()).toEqual(3);
      
   });
   
   it('getRemaining()', function() {
      
      var delay = new gtp.Delay({ millis: 100 });
      expect(delay.getRemaining()).toEqual(100);
      delay.update(50);
      expect(delay.getRemaining()).toEqual(50);
      delay.update(49);
      expect(delay.getRemaining()).toEqual(1);
      delay.update(1);
      expect(delay.getRemaining()).toEqual(0);
      
   });
   
   it('getRemainingPercent()', function() {
      
      var delay = new gtp.Delay({ millis: 100 });
      expect(delay.getRemainingPercent()).toEqual(1);
      delay.update(50);
      expect(delay.getRemainingPercent()).toEqual(0.5);
      delay.update(49);
      expect(delay.getRemainingPercent()).toEqual(0.01);
      delay.update(1);
      expect(delay.getRemaining()).toEqual(0);
      
   });
   
   it('isDone()', function() {
      
      // Verify isDone() only returns true when total delay has passed.
      var delay = new gtp.Delay({ millis: 100 });
      expect(delay.isDone()).toEqual(false);
      delay.update(50);
      expect(delay.isDone()).toEqual(false);
      delay.update(49);
      expect(delay.isDone()).toEqual(false);
      delay.update(1);
      expect(delay.isDone()).toEqual(true);
      
   });
   
});