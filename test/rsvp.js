var test = require('tape')
var pull = require('pull-stream')
var ssbKeys = require('ssb-keys')
var schema = require('ssb-msg-schemas')
var validGathering = require('./util/validGathering')
validGathering.type = 'gathering'

var Rsvp = require('./util/rsvp');

var createSbot = require('scuttlebot')
  .use(require('../'))


test('can get all rsvps on an gathering and filter by type vote', function(t) {
  var pietKey = ssbKeys.generate()
  var sbot = createSbot({temp:'piety', keys: pietKey})

  sbot.publish(validGathering,function(err, gathering) {
    var id = gathering.key 
    sbot.publish(Rsvp(id, 1),function(err, vote) {
      sbot.publish(schema.post('wee',null, null, id), function(err, comment) {

        pull(sbot.gatherings.rsvpsOnGathering(id, {live: false}), pull.collect(function(err, data) {
          t.equal(data.length, 1, 'one link references gathering')
          t.deepEqual(data[0], vote.value)
          sbot.close()
          t.end()
        }))
      })
    })
  })
})


