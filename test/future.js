var pull = require('pull-stream')
var test = require('tape');
var moment = require('moment')

var validGathering = require('./util/validGathering')
validGathering.type = 'gathering'

test('findFuture', function(t) {
  var testBot = require('./util/createTestSbot')('teste2')
  var futureDateTime = moment().add(1, 'days').toDate()
  var pastDateTime  = moment().subtract(1, 'days').toDate()

  testBot.gatherings.create({type: 'gathering', dateTime: futureDateTime}, function() {
    
  })
  testBot.gatherings.create({type: 'gathering', dateTime: pastDateTime}, function() {
    
  })
  testBot.gatherings.create({type: 'gathering', dateTime: futureDateTime}, function() {
    
  })
  testBot.gatherings.create({type: 'gathering', dateTime: pastDateTime}, function() {
    
  })

  pull(testBot.gatherings.future(),pull.take(2), pull.collect(function(err, records) {
   t.true(moment(records[0].dateTime).isAfter(new Date()), 'gathering is in the future') 
   t.true(moment(records[1].dateTime).isAfter(new Date()), 'gathering is in the future') 
   t.end()
   testBot.close()
   return false
  }))   
})
