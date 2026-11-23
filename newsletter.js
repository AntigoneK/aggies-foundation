// Newsletter signup — sends the submitted email to a Google Sheet via a
// Google Apps Script Web App endpoint. See README-newsletter.md for how
// that endpoint is set up and how to change it.
(function () {
  // TODO: replace with the deployed Apps Script Web App URL (ends in /exec)
  var ENDPOINT = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

  var form = document.getElementById('newsletter-form');
  if (!form) return;

  var emailInput = form.querySelector('input[type="email"]');
  var button = form.querySelector('button');
  var status = document.getElementById('newsletter-status');

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var email = (emailInput.value || '').trim();
    if (!email) return;

    if (!ENDPOINT || ENDPOINT.indexOf('PASTE_YOUR') === 0) {
      setStatus("Signup isn't connected yet — check back soon.");
      return;
    }

    var originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Subscribing…';
    setStatus('');

    var body = new URLSearchParams();
    body.set('email', email);

    // The Apps Script endpoint doesn't send CORS headers we can read from
    // a different origin, so this uses "no-cors": the request still goes
    // through and gets recorded, we just can't read its response back.
    fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: body })
      .then(function () {
        setStatus('Thanks for subscribing!');
        form.reset();
      })
      .catch(function () {
        setStatus('Something went wrong — please try again.');
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = originalLabel;
      });
  });
})();
