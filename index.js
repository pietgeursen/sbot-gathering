var api = require('./api')
var pull = require('pull-stream')
var moment = require('moment')

module.exports = {
  name: 'gatherings',
  version: '0.0.0',
  manifest: api,
  permissions: {},
  init: function (sbot, config) {
    function find (opts) {
      var _opts = Object.assign({type: 'gathering', live: true}, opts)
      return sbot.messagesByType(_opts)
    }
    function future (opts) {
      return pull(
        find(opts),
        pull.filter(function (gathering) {
          return moment(gathering.value.content.dateTime).isAfter(moment())
        }),
        pull.map(function (gathering) {
          return Object.assign({}, gathering.value.content, {author: gathering.value.author, id: gathering.key})
        })
      )
    }
    function findAuthorNameOfMessage (msg, cb) {
      var _opts = {type: 'about', live: false}
      pull(
        sbot.messagesByType(_opts),
        pull.collect(function (err, array) {
          if (err) cb(err)
          var names = array.map(function (about) {
            return about.value.content.name
          })

          cb(null, names[names.length - 1])
        })
      )
    }
    // function addAuthorName () {
    //  return pull.asyncMap(function (message, cb) {
    //    findAuthorNameOfMessage(message, function (err, res) {
    //      message.value.content.authorName = res
    //      cb(null, message)
    //    })
    //  })
    // }
    function hosting (opts) {
      return pull(find(opts), pull.filter(function (gathering) {
        return gathering.value.author === sbot.id
      }))
    }
    function create (gathering, cb) {
      sbot.publish(gathering, cb)
    }
    function linksToGathering (gatheringId, opts) {
      var _opts = Object.assign({dest: gatheringId, live: true}, opts)
      return pull(
        sbot.links(_opts),
        pull.asyncMap(function (data, cb) {
          sbot.get(data.key, cb)
        }))
    }
    function commentsOnGatherings (opts) {
      const gatherings = []
      pull(
        find(),
        pull.drain(function (gathering) {
          console.log('pushed a gathering')
          gatherings.push(gathering)
        }))

      var _opts = Object.assign({type: 'post', live: true}, opts)
      return pull(
        sbot.messagesByType(_opts),
        pull.filter(function (post) {
          return gatherings.some(function (gathering) {
            return gathering.id === post.mentions
          })
        }),
        pull.map(function (post) {
          console.log('returned a post')
          return post.value
        })
      )
    }
    function rsvpsOnGathering (gatheringId, opts) {
      return pull(
        linksToGathering(gatheringId, opts),
        pull.filter(function (data) {
          return data.content.type === 'rsvp'
        }))
    }
    function myRsvps (opts) {
      var _opts = Object.assign({type: 'rsvp', live: true}, opts)
      return pull(
        sbot.messagesByType(_opts),
        pull.filter(function (message) {
          return message.value.author === sbot.whoami().id
        }),
        pull.map(function (message) {
          return message.value.content.vote
        })
      )
    }
    return {
      find: find,
      future: future,
      create: create,
      hosting: hosting,
      linksToGathering: linksToGathering,
      commentsOnGatherings: commentsOnGatherings,
      rsvpsOnGathering: rsvpsOnGathering,
      myRsvps: myRsvps,
      findAuthorNameOfMessage: findAuthorNameOfMessage
    }
  }
}
