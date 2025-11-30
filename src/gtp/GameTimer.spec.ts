import GameTimer from './GameTimer.js';

describe('_GameTimer', () => {

	it('get/set paused should work', () => {

		const timer: GameTimer = new GameTimer();
		expect(timer.paused).toEqual(false);
		timer.paused = true;
		expect(timer.paused).toEqual(true);
	});

	it('get/set updating should work', () => {

		const timer: GameTimer = new GameTimer();
		expect(timer.updating).toEqual(true);
		timer.updating = false;
		expect(timer.updating).toEqual(false);
	});

	it('playTime increases as time goes on', async() => {
		const timer: GameTimer = new GameTimer();
		timer.start();
		const origPlayTime: number = timer.playTime; // This may be > 0 already
		await new Promise(r => setTimeout(r, 50));
		expect(timer.playTime).toBeGreaterThan(origPlayTime);
	});

	it('resetPlayTime should set play time back to 0', async() => {
		const timer: GameTimer = new GameTimer();
		timer.start();
		await new Promise(r => setTimeout(r, 50));
		const origPlayTime: number = timer.playTime;
		timer.resetPlayTime();
		// Note timer.playTime may be > 0 by the time it's queried again
		expect(timer.playTime).toBeLessThan(origPlayTime);
	});

	it('resetPlayTime should throw an error if called when paused', () => {
		const timer: GameTimer = new GameTimer();
		timer.start();
		timer.paused = true;
		expect(() => { timer.resetPlayTime(); }).toThrowError();
	});

	it('resetPlayTime should throw an error if called when not updating', () => {
		const timer: GameTimer = new GameTimer();
		timer.start();
		timer.updating = false;
		expect(() => { timer.resetPlayTime(); }).toThrowError();
	});
});
