var t = require('tcomb');

var eventEnum = t.enums({event: 'event'})

eventType = t.struct({
  type: eventEnum,
  title: t.String,
  description: t.maybe(t.String),
  dateTime: t.Date,
  location: t.String
}, 'Event')

function Event(e) {
 e.type = eventEnum('event')
 return eventType(e) 
}

module.exports = Event
