'use strict'
const handler = require('./handler')

handler.tags({'body': JSON.stringify({
  'tagCursorArray': [
    { 'tag': 'rock' }
  ]
})}, null, (err, output) => {
  console.log(err);
  console.log(output);
});
