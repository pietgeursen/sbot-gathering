var t = require('tcomb');

var gatheringEnum = t.enums({gathering: 'gathering'})

gatheringType = t.struct({
  type: gatheringEnum,
  title: t.String,
  description: t.maybe(t.String),
  dateTime: t.Date,
  location: t.String
}, 'Gathering')

function Gathering(e) {
 e.type = gatheringEnum('gathering')
 return gatheringType(e) 
}

module.exports = Gathering
