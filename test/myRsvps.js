var test = require('tape')
var pull = require('pull-stream')
var ssbKeys = require('ssb-keys')
var schema = require('ssb-msg-schemas')
var validEvent = require('./util/validEvent')
validEvent.type = 'event'
var Rsvp = require('./util/rsvp');

var createSbot = require('scuttlebot')
  .use(require('../'))

test('can get all votes by me and and filter by source type event', function(t) {
  var pietKey = ssbKeys.generate()
  var sbot = createSbot({temp:'pieterrrr', keys: pietKey})
  var katieKey = ssbKeys.generate()
  var katie = sbot.createFeed(katieKey)

  sbot.publish(validEvent,function(err, event) {
    var id = event.key 
    sbot.publish(Rsvp(id, 1),function(err, vote) {
      katie.publish(Rsvp(id, 1),function(err, vote) {
        pull(sbot.events.myRsvps({live: false}), pull.collect(function(err, data) {
          t.equal(data.length, 1, 'only got my rsvp, not katies')
          t.deepEqual(data[0], vote.value.content)
          sbot.close()
          t.end()
        }))
      })
    })
  })
})


