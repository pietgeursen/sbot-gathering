var test = require('tape');
var validEvent = require('../util/validEvent');
var Event = require('../util/eventType');

test('trying to create an invalid event throws', function(t) {
  t.throws(function() {
    Event({title: 'explode'})  
  })
  t.end()
})

test('create a valid event ok', function(t) {
  t.doesNotThrow(function() {
    Event(validEvent)  
  })
  t.end()
})

