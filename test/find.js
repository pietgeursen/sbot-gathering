var pull = require('pull-stream')
var test = require('tape')
var msgs = require('ssb-msg-schemas')

var validGathering = require('./util/validGathering')
validGathering.type = 'gathering'

test('find', function (t) {
  var testBot = require('./util/createTestSbot')('teste1')

  testBot.gatherings.create(validGathering, function (err, data) {})

  pull(testBot.gatherings.find(), pull.drain(function (record) {
    t.equal(record.value.content.type, 'gathering', 'data has type gathering')
    t.end()
    testBot.close()
    return false
  }))
})
