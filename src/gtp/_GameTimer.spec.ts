import { _GameTimer } from './_GameTimer';

describe('_GameTimer', () => {

	it('get/set paused should work', () => {

		const timer: _GameTimer = new _GameTimer();
		expect(timer.paused).toBeFalsy();
		timer.paused = true;
		expect(timer.paused).toBeTruthy();
	});

	it('get/set updating should work', () => {

		const timer: _GameTimer = new _GameTimer();
		expect(timer.updating).toBeTruthy();
		timer.updating = false;
		expect(timer.updating).toBeFalsy();
	});
});
