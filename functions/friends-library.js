const friends = require('./friends.json');
const documents = require('./documents.json');

exports.handler = async function (event) {
  const path = event.path
    .replace(/^\/rest\//, '')
    .replace(/^\/\.netlify\/functions\//, '')
    .replace(/^\/?friends-library/, '');

  let body = null;
  if (path === '/friends') {
    body = Object.values(friends);
  }

  if (path === '/documents') {
    body = Object.values(documents);
  }

  let friendIdMatch = path.match(/^\/friends\/([0-9a-f-]{36})/);
  if (friendIdMatch && friends[friendIdMatch[1]]) {
    body = friends[friendIdMatch[1]];
  }

  let docIdMatch = path.match(/^\/documents\/([0-9a-f-]{36})/);
  if (docIdMatch && documents[docIdMatch[1]]) {
    body = documents[docIdMatch[1]];
  }

  let statusCode = 200;
  if (!body) {
    statusCode = 404;
    body = { error: 'Not found' };
  }

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(body, null, 2),
  };
};
