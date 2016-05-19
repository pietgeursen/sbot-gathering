module.exports = function (id, vote){
  return { type: 'rsvp', vote: { link: id, value: vote } } 
}
