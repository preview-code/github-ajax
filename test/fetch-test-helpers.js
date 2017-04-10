const newtworkError = async (e) => { throw e }

const serverError = async (code, msg) => () => new Response(null, {
  status: code,
  statusText: msg
})


const jsonOk = async body => () => new Response(JSON.stringify(body), {
  status: 200,
  headers: {
    'Content-type': 'application/json'
  }
});

const respondWith = async (code, headers, body) => () => new Response(JSON.stringify(body), {
  status: code,
  headers: headers
});

const ok = async (headers, body) => await respondWith(200, headers, body);

const echoJson = async request => (await jsonOk(request.url))();

const onRequest = fn => {
  if (window.fetch.restore) window.fetch.restore();

  var callToRespond;
  const continuation = new Promise(resolve => {
    callToRespond = delayedResponder => resolve(delayedResponder);
  });

  sinon.stub(window, 'fetch', async request => {
    var responder = await fn(request);
    if (!responder) {
      responder = await continuation;
    }
    return await responder(request);
  });

  return callToRespond;
}

const onGET = fn => onRequest(request => {
  if (request.method === 'GET') return fn(request);
});

const onPOST = fn => onRequest(request => {
  if (request.method === 'POST') return fn(request);
});


const wait = async () => {}

function getRequestParam(url, variable) {
  var urlSplit = url.split('?');
  if (urlSplit.length === 2) {
    var vars = urlSplit[1].split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
  }
}
