var pull = require('pull-stream')
var test = require('tape');
var moment = require('moment')

var validEvent = require('../util/validEvent')
validEvent.type = 'event'

test('findFuture', function(t) {
  var testBot = require('../util/createTestSbot')('teste2')
  var futureDateTime = moment().add(1, 'days').toDate()
  var pastDateTime  = moment().subtract(1, 'days').toDate()

  testBot.events.create({type: 'event', dateTime: futureDateTime}, function() {
    
  })
  testBot.events.create({type: 'event', dateTime: pastDateTime}, function() {
    
  })
  testBot.events.create({type: 'event', dateTime: futureDateTime}, function() {
    
  })
  testBot.events.create({type: 'event', dateTime: pastDateTime}, function() {
    
  })

  pull(testBot.events.future(),pull.take(2), pull.collect(function(err, records) {
   t.true(moment(records[0].value.content.dateTime).isAfter(new Date()), 'event is in the future') 
   t.equal(records[0].value.sequence, 1, 'event has sequence 1') 
   t.true(moment(records[1].value.content.dateTime).isAfter(new Date()), 'event is in the future') 
   t.equal(records[1].value.sequence, 3, 'event has sequence 3') 
   t.end()
   testBot.close()
   return false
  }))   
})
