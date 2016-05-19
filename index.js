var api = require('./api')
var pull = require('pull-stream')
var moment = require('moment')

module.exports = {
  name: 'events',
  version: '0.0.0',
  manifest: api,
  permissions: {},
  init: function(sbot, config){
    function find(opts){
      var _opts = Object.assign({type: 'event', live: true}, opts)
      return sbot.messagesByType(_opts)
    }
    function future(opts) {
      return pull(find(opts), pull.filter(function(event) {
        return moment(event.value.content.dateTime).isAfter(moment())
      }))
    }
    function hosting(opts){
      return pull(find(opts), pull.filter(function(event) {
        return event.value.author === sbot.id 
      })) 
    }
    function create(event, cb) {
      sbot.publish(event, cb)
    }
    function linksToEvent(eventId, opts) {
      var _opts = Object.assign({dest: eventId, live: true}, opts)
      return pull(
        sbot.links(_opts), 
        pull.asyncMap(function(data, cb) {
          sbot.get(data.key, cb)
        }))
    }
    function commentsOnEvent(eventId, opts){
        return pull(
          linksToEvent(eventId, opts), 
          pull.filter(function(data) {
            return data.content.type == 'post' 
        }))
    }
    function rsvpsOnEvent(eventId, opts){
      return pull(
        linksToEvent(eventId, opts), 
        pull.filter(function(data) {
          return data.content.type == 'rsvp' 
        }))
    }
    function myRsvps(opts) {
      var _opts = Object.assign({type: 'rsvp', live: true}, opts)
      return pull(
        sbot.messagesByType(_opts),
        pull.filter(function(message) {
          return message.value.author == sbot.whoami().id
        }),
        pull.map(function(message) {
          return message.value.content
        })
      )
    }
    return {
      find:find,
      future: future,
      create: create,
      hosting: hosting,
      linksToEvent: linksToEvent,
      commentsOnEvent: commentsOnEvent,
      rsvpsOnEvent: rsvpsOnEvent,
      myRsvps: myRsvps

      }
    }  
}
