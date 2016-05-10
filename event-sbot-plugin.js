var api = require('./api')
var pull = require('pull-stream')
var moment = require('moment')
var Event  = require('./util/eventType');

module.exports = {
  name: 'events',
  version: '0.0.0',
  manifest: {
    find: 'source',
    future: 'source',
    hosting: 'source',
    commentsOnEvent: 'source',
    create: 'async'
  },
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
      //var e = Event(event)
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
          return data.content.type == 'vote' 
        }))
    }
    return {
      find:find,
      future: future,
      create: create,
      hosting: hosting,
      commentsOnEvent: commentsOnEvent,
      rsvpsOnEvent: rsvpsOnEvent
      }
    }  
}

