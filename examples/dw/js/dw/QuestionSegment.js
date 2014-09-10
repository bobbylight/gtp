function QuestionSegment() {
   'use strict';
   this.choices = [ 'Yes', 'No' ]; // Default values
   TalkSegment.apply(this, arguments);
}

QuestionSegment.prototype = Object.create(TalkSegment.prototype, {
   
   
});

QuestionSegment.prototype.constructor = QuestionSegment;
