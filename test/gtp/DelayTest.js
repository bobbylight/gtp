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
   
   it('constructor with deltas specified', function() {
      expect(function() { new gtp.Delay(); }).toThrow();
      expect(function() { new gtp.Delay({}); }).toThrow();
   });
   
   it('constructor with delta specified', function() {
      
      // No delta specified
      var delay = new gtp.Delay({ millis: 100 });
      expect(delay.getMinDelta()).toEqual(-1);
      expect(delay.getMaxDelta()).toEqual(-1);
      
      // Delta specified
      delay = new gtp.Delay({ millis: 100, minDelta: -5, maxDelta: 5 });
      expect(delay.getMinDelta()).toEqual(-5);
      expect(delay.getMaxDelta()).toEqual(5);
      
   });
   
   it('update() without a callback', function() {
      
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
   
   it('update() calls callback when not looping', function() {
      
      var callbackCalled = false;
      var cb = function() {
         callbackCalled = true;
      };
      
      // Calling update() with various millis passed until done.
      var delay = new gtp.Delay({ millis: 100, callback: cb });
      expect(callbackCalled).toEqual(false);
      delay.update(50);
      expect(callbackCalled).toEqual(false);
      delay.update(49);
      expect(callbackCalled).toEqual(false);
      delay.update(1);
      expect(callbackCalled).toEqual(true);
      
   });
   
   it('update() calls callback when looping', function() {
      
      var callbackCalled = false;
      var cb = function() {
         callbackCalled = true;
      };
      
      // Calling update() with various millis passed until done.
      var delay = new gtp.Delay({ millis: 100, callback: cb, loop: true });
      expect(callbackCalled).toEqual(false);
      delay.update(50);
      expect(callbackCalled).toEqual(false);
      delay.update(50);
      expect(callbackCalled).toEqual(true);
      callbackCalled = false;
      delay.update(50);
      expect(callbackCalled).toEqual(false);
      delay.update(50);
      expect(callbackCalled).toEqual(true);
      callbackCalled = false;
      delay.update(50);
      expect(callbackCalled).toEqual(false);
      delay.update(50);
      expect(callbackCalled).toEqual(true);
      
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
   
   it('getMaxDelta()', function() {
      
      var delay = new gtp.Delay({ millis: 100 });
      expect(delay.getMaxDelta()).toEqual(-1);
      
      delay = new gtp.Delay({ millis: 100, minDelta: -5, maxDelta: 5 });
      expect(delay.getMaxDelta()).toEqual(5);
      
   });
   
   it('getMinDelta()', function() {
      
      var delay = new gtp.Delay({ millis: 100 });
      expect(delay.getMinDelta()).toEqual(-1);
      
      delay = new gtp.Delay({ millis: 100, minDelta: -5, maxDelta: 5 });
      expect(delay.getMinDelta()).toEqual(-5);
      
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
   
   it('setRandomDelta()', function() {
      
      // Initially, no random delta
      var delay = new gtp.Delay({ millis: 100 });
      expect(delay.getMinDelta()).toEqual(-1);
      expect(delay.getMaxDelta()).toEqual(-1);
      
      // Setting a random delta
      delay.setRandomDelta(-7, 7);
      expect(delay.getMinDelta()).toEqual(-7);
      expect(delay.getMaxDelta()).toEqual(7);
      
   });
   
   it('reset(smooth=true)', function() {
      
      var delay = new gtp.Delay({ millis: 100, loop: true });
      expect(delay.getRemaining()).toEqual(100);
      delay.update(105); // Calls reset(true)
      expect(delay.getRemaining()).toEqual(95);
   });
   
   it('toString()', function() {
      
      var delay = new gtp.Delay({ millis: 100 });
      expect(delay.toString()).toEqual('[gtp.Delay: _initial=100' +
            ', _remaining=100' +
            ', _loop=false' +
            ', _callback=false' +
            ']');
      
   });
   
});