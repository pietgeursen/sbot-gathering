var pull = require('pull-stream')
var test = require('tape');
var moment = require('moment')

var validEvent = require('../util/validEvent')
validEvent.type = 'event'

test('find', function(t) {
  var testBot = require('../util/createTestSbot')('teste1')

  testBot.events.create(validEvent,function(err, data) {
  })

  pull(testBot.events.find(), pull.drain(function(record) {
   t.equal(record.value.content.type, 'event', 'data has type event') 
   t.end()
   testBot.close()
   return false
  }))   
})
