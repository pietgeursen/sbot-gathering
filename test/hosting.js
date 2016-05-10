var test = require('tape')
var pull = require('pull-stream')
var ssbKeys = require('ssb-keys')
var validEvent = require('../util/validEvent')
validEvent.type = 'event'

var createSbot = require('scuttlebot')
  .use(require('../event-sbot-plugin'))

test('find gets all messages by all authors, hosting gets only messages by me', function(t) {
  var pietKey = ssbKeys.generate()
  var katieKey = ssbKeys.generate()
  var sbot = createSbot({temp:'piet', keys: pietKey})
  var katie = sbot.createFeed(katieKey)
  var piet = sbot.createFeed(pietKey)

  piet.add(validEvent,function(err, data) {})
  katie.add(validEvent,function(err, data) {})

  pull(sbot.events.find(), pull.take(2), pull.collect(function(err, events) {
    t.notEqual(events.findIndex(function(event) {
      return event.value.author ===  piet.id
    }), -1, 'message authored by piet')
    t.notEqual(events.findIndex(function(event) {
      return event.value.author ===  katie.id
    }), -1, 'message authored by katie')
    t.equal(events.length, 2, 'got both events') 
    
    pull(sbot.events.hosting({live: false}), pull.collect(function (err, events){
      t.equal(events.length, 1, 'there is only one event')
      t.equal(events[0].value.author, piet.id, 'and piet is the author')
      t.end()
      sbot.close()
    }))

  }))
  
})


