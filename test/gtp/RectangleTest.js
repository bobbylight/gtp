describe('Rectangle', function() {
   'use strict';

   it('0-arg constructor happy path', function() {
      var rect = new gtp.Rectangle();
      expect(rect.x).toEqual(0);
      expect(rect.y).toEqual(0);
      expect(rect.w).toEqual(0);
      expect(rect.h).toEqual(0);
   });

   it('4-arg constructor happy path', function() {
      var rect = new gtp.Rectangle(42, 41, 40, 39);
      expect(rect.x).toEqual(42);
      expect(rect.y).toEqual(41);
      expect(rect.w).toEqual(40);
      expect(rect.h).toEqual(39);
   });

   it('intersects happy path - false', function() {
      var r1 = new gtp.Rectangle(0, 0, 20, 20);
      var r2 = new gtp.Rectangle(50, 50, 4, 4);
      expect(r1.intersects(r2)).toEqual(false);
      expect(r2.intersects(r1)).toEqual(false);
   });

   it('intersects - invalid rect, negative width', function() {
      var r1 = new gtp.Rectangle(20, 20, -4, -4);
      var r2 = new gtp.Rectangle(50, 50, 4, 4);
      expect(r1.intersects(r2)).toEqual(false);
      expect(r2.intersects(r1)).toEqual(false);
   });

   it('intersects happy path - true', function() {
      var r1 = new gtp.Rectangle(0, 0, 20, 20);
      var r2 = new gtp.Rectangle(10, 10, 20, 20);
      expect(r1.intersects(r2)).toEqual(true);
      expect(r2.intersects(r1)).toEqual(true);
   });

   it('intersects, one containing another', function() {
      var r1 = new gtp.Rectangle(0, 0, 20, 20);
      var r2 = new gtp.Rectangle(5, 5, 5, 5);
      expect(r1.intersects(r2)).toEqual(true);
      expect(r2.intersects(r1)).toEqual(true);
   });

   it('set', function() {
     var r1 = new gtp.Rectangle(0, 0, 20, 20);
     r1.set(5, 6, 7, 8);
     expect(r1.x).toBe(5);
     expect(r1.y).toBe(6);
     expect(r1.w).toBe(7);
     expect(r1.h).toBe(8);
   })
});
