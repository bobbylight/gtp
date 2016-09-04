describe('FadeOutInState', function() {
    'use strict';

    it('constructor happy path', function() {

        var leavingState = new gtp.State();
        var enteringState = new gtp.State();
        var temp = {
            transitionLogic: function() {}
        };
        var timeMillis = 500;

        spyOn(temp, 'transitionLogic');

        var state = new gtp.FadeOutInState(leavingState, enteringState,
            temp.transitionLogic, timeMillis);
        expect(temp.transitionLogic).not.toHaveBeenCalled();
    });

    it('transitionLogic is called at halfway point', function() {

        var leavingState = new gtp.State();
        var enteringState = new gtp.State();
        var temp = {
            transitionLogic: function() {}
        };
        var timeMillis = 500;

        spyOn(temp, 'transitionLogic');

        var state = new gtp.FadeOutInState(leavingState, enteringState,
            temp.transitionLogic, timeMillis);
        expect(temp.transitionLogic).not.toHaveBeenCalled();

        state.update(timeMillis / 2 - 1);
        expect(temp.transitionLogic).not.toHaveBeenCalled();

        state.update(1);
        expect(temp.transitionLogic).toHaveBeenCalled();
    });

});