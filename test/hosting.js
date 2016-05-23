var test = require('tape')
var pull = require('pull-stream')
var ssbKeys = require('ssb-keys')
var validGathering = require('./util/validGathering')
validGathering.type = 'gathering'

var createSbot = require('scuttlebot')
  .use(require('../'))

test('find gets all messages by all authors, hosting gets only messages by me', function(t) {
  var pietKey = ssbKeys.generate()
  var katieKey = ssbKeys.generate()
  var sbot = createSbot({temp:'piet', keys: pietKey})
  var katie = sbot.createFeed(katieKey)
  var piet = sbot.createFeed(pietKey)

  piet.add(validGathering,function(err, data) {})
  katie.add(validGathering,function(err, data) {})

  pull(sbot.gatherings.find(), pull.take(2), pull.collect(function(err, gatherings) {
    t.notEqual(gatherings.findIndex(function(gathering) {
      return gathering.value.author ===  piet.id
    }), -1, 'message authored by piet')
    t.notEqual(gatherings.findIndex(function(gathering) {
      return gathering.value.author ===  katie.id
    }), -1, 'message authored by katie')
    t.equal(gatherings.length, 2, 'got both gatherings') 
    
    pull(sbot.gatherings.hosting({live: false}), pull.collect(function (err, gatherings){
      t.equal(gatherings.length, 1, 'there is only one gathering')
      t.equal(gatherings[0].value.author, piet.id, 'and piet is the author')
      t.end()
      sbot.close()
    }))

  }))
  
})


