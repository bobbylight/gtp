describe('AssetLoader', function() {
    'use strict';

    beforeEach(function() {
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('constructor, happy path', function() {
        new gtp.AssetLoader(1, null);
    });

    it('isDoneLoading() works', function() {

        // Initially nothing queued up, so we're "done loading"
        var assetLoader = new gtp.AssetLoader(1, null);
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