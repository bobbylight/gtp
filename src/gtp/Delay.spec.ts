import { Delay } from '../index.js';
import { DelayCallback } from './Delay.js';

describe('Delay', () => {

	it('constructor happy path', () => {
		const delay: Delay = new Delay({millis: 100});
		expect(delay.isDone()).toEqual(false);
	});

	it('constructor with delta specified', () => {

		// No delta specified
		let delay: Delay = new Delay({millis: 100});
		expect(delay.getMinDelta()).toEqual(-1);
		expect(delay.getMaxDelta()).toEqual(-1);

		// Delta specified
		delay = new Delay({millis: 100, minDelta: -5, maxDelta: 5});
		expect(delay.getMinDelta()).toEqual(-5);
		expect(delay.getMaxDelta()).toEqual(5);

	});

	it('update() without a callback', () => {

		// Calling update() with various millis passed until done.
		const delay: Delay = new Delay({millis: 100});
		expect(delay.isDone()).toEqual(false);
		delay.update(50);
		expect(delay.isDone()).toEqual(false);
		delay.update(49);
		expect(delay.isDone()).toEqual(false);
		delay.update(1);
		expect(delay.isDone()).toEqual(true);

	});

	it('update() calls callback when not looping', () => {

		let callbackCalled= false;
		const cb: DelayCallback = () => {
			callbackCalled = true;
		};

		// Calling update() with various millis passed until done.
		const delay: Delay = new Delay({millis: 100, callback: cb});
		expect(callbackCalled).toEqual(false);
		delay.update(50);
		expect(callbackCalled).toEqual(false);
		delay.update(49);
		expect(callbackCalled).toEqual(false);
		delay.update(1);
		expect(callbackCalled).toEqual(true);

	});

	it('update() calls callback when looping', () => {

		let callbackCalled= false;
		const cb: DelayCallback = () => {
			callbackCalled = true;
		};

		// Calling update() with various millis passed until done.
		const delay: Delay = new Delay({millis: 100, callback: cb, loop: true});
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

	it('getLoopCount()', () => {

		// Looping not enabled => getLoopCount() always returns 0
		let delay: Delay = new Delay({millis: 100});
		expect(delay.getLoopCount()).toEqual(0);
		delay.update(100);
		expect(delay.isDone()).toEqual(true);
		expect(delay.getLoopCount()).toEqual(0);

		// Infinite looping => getLoopCount() updates on interval
		delay = new Delay({millis: 100, loop: true});
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
		delay = new Delay({millis: 100, loop: true, loopCount: 3});
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

	it('getMaxDelta()', () => {

		let delay: Delay = new Delay({millis: 100});
		expect(delay.getMaxDelta()).toEqual(-1);

		delay = new Delay({millis: 100, minDelta: -5, maxDelta: 5});
		expect(delay.getMaxDelta()).toEqual(5);

	});

	it('getMinDelta()', () => {

		let delay: Delay = new Delay({millis: 100});
		expect(delay.getMinDelta()).toEqual(-1);

		delay = new Delay({millis: 100, minDelta: -5, maxDelta: 5});
		expect(delay.getMinDelta()).toEqual(-5);

	});

	it('getRemaining()', () => {

		const delay: Delay = new Delay({millis: 100});
		expect(delay.getRemaining()).toEqual(100);
		delay.update(50);
		expect(delay.getRemaining()).toEqual(50);
		delay.update(49);
		expect(delay.getRemaining()).toEqual(1);
		delay.update(1);
		expect(delay.getRemaining()).toEqual(0);

	});

	it('getRemainingPercent()', () => {

		const delay: Delay = new Delay({millis: 100});
		expect(delay.getRemainingPercent()).toEqual(1);
		delay.update(50);
		expect(delay.getRemainingPercent()).toEqual(0.5);
		delay.update(49);
		expect(delay.getRemainingPercent()).toEqual(0.01);
		delay.update(1);
		expect(delay.getRemaining()).toEqual(0);

	});

	it('isDone()', () => {

		// Verify isDone() only returns true when total delay has passed.
		const delay: Delay = new Delay({millis: 100});
		expect(delay.isDone()).toEqual(false);
		delay.update(50);
		expect(delay.isDone()).toEqual(false);
		delay.update(49);
		expect(delay.isDone()).toEqual(false);
		delay.update(1);
		expect(delay.isDone()).toEqual(true);

	});

	it('setRandomDelta()', () => {

		// Initially, no random delta
		const delay: Delay = new Delay({millis: 100});
		expect(delay.getMinDelta()).toEqual(-1);
		expect(delay.getMaxDelta()).toEqual(-1);

		// Setting a random delta
		delay.setRandomDelta(-7, 7);
		expect(delay.getMinDelta()).toEqual(-7);
		expect(delay.getMaxDelta()).toEqual(7);

	});

	it('update() with a delta smaller than the delay and looping enabled', () => {

		const delay: Delay = new Delay({millis: 100, loop: true});
		expect(delay.getRemaining()).toEqual(100);
		delay.update(30);
		expect(delay.getRemaining()).toEqual(70);
	});

	it('update() with a delta larger than the delay and looping enabled', () => {

		const delay: Delay = new Delay({millis: 100, loop: true});
		expect(delay.getRemaining()).toEqual(100);
		delay.update(105); // Calls nextInitial(true)
		expect(delay.getRemaining()).toEqual(95);
	});

	it('update() with a delta larger than the delay and looping disabled', () => {

		const delay: Delay = new Delay({millis: 100});
		expect(delay.getRemaining()).toEqual(100);
		delay.update(105); // Calls nextInitial(true)
		expect(delay.getRemaining()).toEqual(0);
	});

	it('toString()', () => {

		const delay: Delay = new Delay({millis: 100});
		expect(delay.toString()).toEqual('[Delay: initial=100' +
			', remaining=100' +
			', loop=false' +
			', callback=false' +
			']');

	});
});
