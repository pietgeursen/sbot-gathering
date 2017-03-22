# sbot-gatherings

> '[patchcore](https://github.com/ssbc/patchcore) gatherings [depject](https://github.com/depject/depject) plugin for [secure scuttlebutt](https://github.com/ssbc/secure-scuttlebutt)'

## About
`gives` pull-stream sources and observables for building views of gatherings on patchwork

## Needs
```js
exports.needs = nest({
  'sbot.pull.messagesByType': 'first',
  'sbot.pull.links': 'first',
})
```

## Gives
```js
exports.gives = nest({
  'gatherings.pull': [
    'upcoming',
    'hosting',
  ],
  'gatherings.async': [
    'create',
    'setName',
    'setUTCDateTime',
    'setLocation',
    'setDescription',
    'setHosts',
  ]
})
```


## Message types

## API

### gatherings.async.create(opts={}, cb)

Creates a new gathering message and calls cb when done. Valid `opts` keys include

- `name` (optional) - The name of the gathering 
- `utcDateTime` (optional) - The utc date and time of the gathering 
- `location` (optional) - The location of the gathering
- `description` (optional) - The desctription of the gathering 
- `hosts` (optional) - Hosts of the gathering

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install sbot-gatherings
```

## Acknowledgments

sbot-gatherings was inspired by..

## See Also


## License

ISC

