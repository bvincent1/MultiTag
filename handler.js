'use strict';

const rp = require('request-promise');
const _ = require('underscore');

function containsSubArray(array, sub) {
  return _.isEqual(_.intersection(sub, array), sub);
}

module.exports.tags = (event, context, callback) => {
  if (event && event.body) {
    const data = JSON.parse(event.body);

    let responses = data.tagCursorArray.map((tagCursorObject) => {
      let searchString = '?count=10';

      if (tagCursorObject.cursor) {
        searchString += '&tagName=' + tagCursorObject.tag + '&cursor=' + tagCursorObject.cursor;
      }
      else {
        searchString += '&tagName=' + tagCursorObject.tag;
      }

      console.log(searchString);
      return rp({
          'uri': 'https://api.gfycat.com/v1test/gfycats/trending' + searchString,
          'json': true,
          'headers': {
            'User-Agent': 'MultiTagv1.0'
          }
        });
    });

    Promise.all(responses).then((respJson) => {
      let gfycatArray = [];
      let tagCursorArray= [];

      for (let gifObject of respJson) {
        tagCursorArray.push( {'tag': gifObject.tag, 'cursor': gifObject.cursor} );

        for (let gfycat of gifObject.gfycats) {
          if (containsSubArray(
            gfycat.tags.map((t) => {return t.toLowerCase()} ),
            data.tagCursorArray.map((t) => {return t['tag'].toLowerCase()} )
          )) {
            gfycatArray.push(gfycat);
          }
        }
      }

      const response = {
        statusCode: 200,
        body: JSON.stringify({
          'gfycatArray': gfycatArray,
          'tagCursorArray': tagCursorArray,
          'input': event
        }),
      };
      callback(null, response);
    }).catch((error) => {
      callback(error);
    });
  }
  else {
    callback(new Error('Invalid event: ' + JSON.stringify(event)));
  }
};
