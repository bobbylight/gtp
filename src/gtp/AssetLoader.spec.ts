import {AssetLoader} from './AssetLoader';
import {AudioSystem} from './AudioSystem';

describe('AssetLoader', () => {
	'use strict';

	beforeEach(() => {
		jasmine.Ajax.install();
	});

	afterEach(() => {
		jasmine.Ajax.uninstall();
	});

	it('constructor, happy path', () => {
		new AssetLoader(1, new AudioSystem()); // tslint:disable-line
	});

	it('isDoneLoading() works', () => {

		// Initially nothing queued up, so we're "done loading"
		const assetLoader: AssetLoader = new AssetLoader(1, new AudioSystem());
		expect(assetLoader.isDoneLoading()).toBeTruthy();

		// Add something to load, now we're waiting
		assetLoader.addJson('testJson', '/fake/url.json');
		expect(jasmine.Ajax.requests.mostRecent().url).toBe('/fake/url.json');
		expect(assetLoader.isDoneLoading()).toBeFalsy();

		// Mock a response, which triggers AssetLoader to receive the response as well
		jasmine.Ajax.requests.mostRecent().respondWith({
			status: 200,
			contentType: 'application/json',
			responseText: '{ "data": 1 }'
		});

		// Now that we've received the response, check that we're "done loading" again
		expect(assetLoader.isDoneLoading()).toBeTruthy();
	});
});
