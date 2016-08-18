var pull = require('pull-stream')
var test = require('tape')
var msgs = require('ssb-msg-schemas')

var validGathering = require('./util/validGathering')
validGathering.type = 'gathering'

test('can find author name of a published message', function (t) {
  var testBot = require('./util/createTestSbot')('teste2')
  var name = 'teste'

  pull(
    nameMyBotSource(name, testBot),
    pull.asyncMap(function (data, cb) {
      testBot.gatherings.create(validGathering, cb)
    }),
    pull.drain(function () {})
  )

  pull(
    testBot.gatherings.find(),
    pull.asyncMap(function (data, cb) {
      testBot.gatherings.findAuthorNameOfMessage(data.value.author, cb)
    }),
    pull.take(1),
    pull.drain(function (author) {
      t.equal(author, name, 'record has the author name')
      t.end()
      testBot.close()
      return false
    }))
})

// move this
function nameMyBotSource (name, sbot) {
  return pull(
    pull.once(1),
    pull.asyncMap(function (data, cb) {
      sbot.whoami(cb)
    }),
    pull.asyncMap(function (me, cb) {
      sbot.publish(msgs.name(me.id, name), cb)
    })
  )
}
