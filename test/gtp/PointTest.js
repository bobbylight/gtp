describe('Point', function() {
  'use strict';

  it('constructor 0-arg', function() {
    var point = new gtp.Point();
    expect(point.x).toBe(0);
    expect(point.y).toBe(0);
  });

  it('constructor 1-arg', function() {
    var point = new gtp.Point(3);
    expect(point.x).toBe(3);
    expect(point.y).toBe(0);
  });

  it('constructor 2-arg', function() {
    var point = new gtp.Point(3, 4);
    expect(point.x).toBe(3);
    expect(point.y).toBe(4);
  });

  it('equals null arg', function() {
    var point = new gtp.Point(3, 4);
    expect(point.equals(null)).toBeFalsy();
  });

  it('equals false', function() {
    var point = new gtp.Point(3, 4);
    var point2 = new gtp.Point(3, 5);
    expect(point.equals(point2)).toBeFalsy();
  });

  it('equals true', function() {
    var point = new gtp.Point(3, 4);
    var point2 = new gtp.Point(3, 4);
    expect(point.equals(point2)).toBeTruthy();
    expect(point.equals(point)).toBeTruthy();
  });

});
