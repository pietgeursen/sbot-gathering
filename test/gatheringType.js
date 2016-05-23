var test = require('tape');
var validGathering = require('./util/validGathering');
var Gathering = require('../gatheringType');

test('trying to create an invalid gathering throws', function(t) {
  t.throws(function() {
    Gathering({title: 'explode'})  
  })
  t.end()
})

test('create a valid gathering ok', function(t) {
  t.doesNotThrow(function() {
    Gathering(validGathering)  
  })
  t.end()
})

