function TalkManager() {
   'use strict';
   this._segments = [];
}

TalkManager.prototype = (function() {
   'use strict';
   
   return {
      
      /**
       * Adds a segment to this conversation.
       * 
       * @param {TalkSegment} segment A segment to add to this conversation.
       *        This can also be a simple string for a single text segment.
       */
      addSegment: function(segment) {
         if (segment.length) { // A string
            segment = new TalkSegment(segment);
         }
         this._segments.push(segment);
      },
      
      /**
       * Adds one or more segments to this conversation.
       * 
       * @param {TalkSegment[]} segments Either a single segment, or an array
       *        of segments.
       */
      setSegments: function(segments) {
         if (Array.isArray(segments)) {
            for (var i=0; i<segments.length; i++) {
               this.addSegment(segments[i]);
            }
         }
         else {
            this.addSegment(segments);
         }
      },
      
      start: function() {
         this._segmentIndex = 0;
         return this.next();
      },
      
      hasNext: function() {
         return this._segmentIndex < this._segments.length;
      },
      
      next: function() {
         return this._segments[this._segmentIndex++];
      }
      
   };
   
})();