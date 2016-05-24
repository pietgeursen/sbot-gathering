var pull = require('pull-stream')
var test = require('tape');

var validGathering = require('./util/validGathering')
validGathering.type = 'gathering'

test('create', function(t) {
  var testBot = require('./util/createTestSbot')('teste')
  
  testBot.gatherings.create(validGathering,function(err, data) {
    t.false(err, 'creates gathering without error')
    t.end()
    testBot.close()
    return false
  })
})

