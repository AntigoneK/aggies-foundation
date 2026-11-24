// Newsletter signup, sends the submitted email to a Google Sheet via a
// Google Apps Script Web App endpoint. See README-newsletter.md for how
// that endpoint is set up and how to change it.
//
// Supports more than one signup form per page (e.g. a footer form and a
// dedicated homepage section): every element with class "newsletter-form"
// gets wired up independently, and each looks for its own status message
// in the next element with class "newsletter-status".
(function () {
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzcYAISeMKPuU1xFEz6jL7T3D5MYFqweuYF4p61Hq_bDlWXt0bmmkBfWu57nhBgmvKDEQ/exec';

  var forms = document.querySelectorAll('.newsletter-form');
  if (!forms.length) return;

  forms.forEach(function (form) {
    var emailInput = form.querySelector('input[type="email"]');
    var button = form.querySelector('button');
    var status = form.nextElementSibling;
    if (!status || !status.classList.contains('newsletter-status')) {
      status = null;
    }

    function setStatus(message) {
      if (status) status.textContent = message;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var email = (emailInput.value || '').trim();
      if (!email) return;

      if (!ENDPOINT || ENDPOINT.indexOf('PASTE_YOUR') === 0) {
        setStatus("Signup isn't connected yet. Check back soon.");
        return;
      }

      var originalLabel = button.textContent;
      button.disabled = true;
      button.textContent = 'Subscribing…';
      setStatus('');

      var body = new URLSearchParams();
      body.set('email', email);

      // The Apps Script endpoint doesn't send CORS headers we can read
      // from a different origin, so this uses "no-cors": the request
      // still goes through and gets recorded, we just can't read its
      // response back.
      fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: body })
        .then(function () {
          setStatus('Thanks for subscribing!');
          form.reset();
        })
        .catch(function () {
          setStatus('Something went wrong. Please try again.');
        })
        .finally(function () {
          button.disabled = false;
          button.textContent = originalLabel;
        });
    });
  });
})();
