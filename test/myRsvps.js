var test = require('tape')
var pull = require('pull-stream')
var ssbKeys = require('ssb-keys')
var schema = require('ssb-msg-schemas')
var validGathering = require('./util/validGathering')
validGathering.type = 'gathering'
var Rsvp = require('./util/rsvp');

var createSbot = require('scuttlebot')
  .use(require('../'))

test('can get all votes by me and and filter by source type gathering', function(t) {
  var pietKey = ssbKeys.generate()
  var sbot = createSbot({temp:'pieterrrr', keys: pietKey})
  var katieKey = ssbKeys.generate()
  var katie = sbot.createFeed(katieKey)

  sbot.publish(validGathering,function(err, gathering) {
    var id = gathering.key 
    sbot.publish(Rsvp(id, 1),function(err, vote) {
      katie.publish(Rsvp(id, 1),function(err, vote) {
        pull(sbot.gatherings.myRsvps({live: false}), pull.collect(function(err, data) {
          t.equal(data.length, 1, 'only got my rsvp, not katies')
          t.deepEqual(data[0], vote.value.content.vote)
          sbot.close()
          t.end()
        }))
      })
    })
  })
})


