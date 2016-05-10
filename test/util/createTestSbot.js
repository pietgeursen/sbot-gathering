var ssbKeys = require('ssb-keys')

var createSbot = require('scuttlebot')
  .use(require('../../'))

function createTestBot(name) {
 return createSbot({keys: ssbKeys.generate(), temp: name})
}

module.exports = createTestBot 


