describe('Pool', function() {
'use strict';

  function Widget() {
    this.type = null;
    this.price = 0;
  }

  it('constructor, 0-arg', function() {
    var pool = new gtp.Pool(Widget);
    expect(pool.borrowedCount).toBe(0);
    expect(pool.length).toBe(20);
  });

  it('constructor, 1-arg', function() {
    var pool = new gtp.Pool(Widget, 50);
    expect(pool.borrowedCount).toBe(0);
    expect(pool.length).toBe(50);
  });

  it('borrowObj() happy path', function() {

    var pool = new gtp.Pool(Widget);
    expect(pool.borrowedCount).toBe(0);

    var widget = pool.borrowObj();
    expect(pool.borrowedCount).toBe(1);
    expect(widget.type).toBeNull();
    expect(widget.price).toBe(0);

    pool.returnObj(widget);
    expect(pool.borrowedCount).toBe(0);
  });

  it('borrowObj() until pool grown', function() {

    var growCount = 7;
    var pool = new gtp.Pool(Widget, 3, growCount);
    expect(pool.borrowedCount).toBe(0);

    var widget1 = pool.borrowObj();
    var widget2 = pool.borrowObj();
    var widget3 = pool.borrowObj();
    expect(pool.borrowedCount).toBe(3);
    expect(pool.length).toBe(3 + growCount);
  });

  it('returnObj() happy path', function() {

    var pool = new gtp.Pool(Widget);
    expect(pool.borrowedCount).toBe(0);

    var widget = pool.borrowObj();
    expect(pool.borrowedCount).toBe(1);
    expect(widget.type).toBeNull();
    expect(widget.price).toBe(0);

    var result = pool.returnObj(widget);
    expect(result).toBeTruthy();
    expect(pool.borrowedCount).toBe(0);
  });

  it('returnObj() invalid object', function() {

    var pool = new gtp.Pool(Widget);
    expect(pool.borrowedCount).toBe(0);

    var result = pool.returnObj('hello world');
    expect(result).toBeFalsy();
    expect(pool.borrowedCount).toBe(0);
  });

  it('reset() happy path', function() {

    var pool = new gtp.Pool(Widget);
    expect(pool.borrowedCount).toBe(0);

    var widget1 = pool.borrowObj();
    var widget2 = pool.borrowObj();
    var widget3 = pool.borrowObj();
    expect(pool.borrowedCount).toBe(3);

    pool.reset();
    expect(pool.borrowedCount).toBe(0);
  });

  it('toString()', function() {
    var pool = new gtp.Pool(Widget);
    var actual = pool.toString();
    expect(actual).toBe('[gtp.Pool: borrowed=0, size=20]');
  });
});
