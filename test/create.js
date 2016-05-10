var pull = require('pull-stream')
var test = require('tape');

var validEvent = require('./util/validEvent')
validEvent.type = 'event'

test('create', function(t) {
  var testBot = require('./util/createTestSbot')('teste')
  
  testBot.events.create(validEvent,function(err, data) {
    t.false(err, 'creates event without error')
    t.end()
    testBot.close()
    return false
  })
})

