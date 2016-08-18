var test = require('tape')
var pull = require('pull-stream')
var ssbKeys = require('ssb-keys')
var schema = require('ssb-msg-schemas')
var validGathering = require('./util/validGathering')
validGathering.type = 'gathering'

var createSbot = require('scuttlebot')
  .use(require('../'))

test('can get all comments on all gatherings and filter by type post', function (t) {
  var pietKey = ssbKeys.generate()
  var sbot = createSbot({temp: 'piety', keys: pietKey})

  sbot.publish(validGathering, function (err, gathering) {
    t.error(err)
    var id = gathering.key
    sbot.publish(schema.vote(gathering.key, 1), function (err, vote) {
      t.error(err)
      sbot.publish(schema.post('wee', null, null, id), function (err, comment) {
        t.error(err)
        pull(sbot.gatherings.commentsOnGatherings({live: false}), pull.collect(function (err, data) {
          t.error(err)
          t.equal(data.length, 1, 'one link references gathering')
          t.deepEqual(data[0], comment.value)
          sbot.close()
          t.end()
        }))
      })
    })
  })
})
