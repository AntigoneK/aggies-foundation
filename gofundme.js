// GoFundMe countdown / progress / donate widget — shared by index.html
// and donate.html. Reads GOFUNDME_CAMPAIGN from gofundme-config.js.
//
// Each ".fundraising-widget" on the page shows exactly one of three
// states, switched automatically:
//   1. Before launchDate            -> countdown
//   2. After launchDate, URL set    -> progress bar + donate button
//   3. After launchDate, no URL yet -> "launching very soon" message
(function () {
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function renderWidget(widget) {
    var countdown = widget.querySelector('.fw-countdown');
    var progress = widget.querySelector('.fw-progress');
    var soon = widget.querySelector('.fw-soon');

    var launch = new Date(GOFUNDME_CAMPAIGN.launchDate);
    var hasUrl = !!(GOFUNDME_CAMPAIGN.gofundmeUrl && GOFUNDME_CAMPAIGN.gofundmeUrl.trim());

    function tick() {
      var diff = launch - new Date();

      if (diff > 0) {
        if (countdown) countdown.hidden = false;
        if (progress) progress.hidden = true;
        if (soon) soon.hidden = true;

        var totalSeconds = Math.floor(diff / 1000);
        var days = Math.floor(totalSeconds / 86400);
        var hours = Math.floor((totalSeconds % 86400) / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;

        var elDays = widget.querySelector('.fw-days');
        var elHours = widget.querySelector('.fw-hours');
        var elMinutes = widget.querySelector('.fw-minutes');
        var elSeconds = widget.querySelector('.fw-seconds');

        if (elDays) elDays.textContent = pad(days);
        if (elHours) elHours.textContent = pad(hours);
        if (elMinutes) elMinutes.textContent = pad(minutes);
        if (elSeconds) elSeconds.textContent = pad(seconds);

        return;
      }

      clearInterval(widget._fwInterval);

      if (hasUrl) {
        if (countdown) countdown.hidden = true;
        if (soon) soon.hidden = true;
        if (progress) progress.hidden = false;

        var goal = GOFUNDME_CAMPAIGN.goal || 0;
        var raised = GOFUNDME_CAMPAIGN.raised || 0;
        var pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

        var fill = widget.querySelector('.fw-progress-fill');
        if (fill) fill.style.width = pct + '%';

        var raisedLabel = widget.querySelector('.fw-raised-label');
        if (raisedLabel) raisedLabel.textContent = '€' + raised.toLocaleString('en-GB') + ' raised';

        var goalLabel = widget.querySelector('.fw-goal-label');
        if (goalLabel) goalLabel.textContent = 'of €' + goal.toLocaleString('en-GB') + ' goal';

        widget.querySelectorAll('.fw-donate-link').forEach(function (link) {
          link.href = GOFUNDME_CAMPAIGN.gofundmeUrl;
        });
      } else {
        if (countdown) countdown.hidden = true;
        if (progress) progress.hidden = true;
        if (soon) soon.hidden = false;
      }
    }

    tick();
    widget._fwInterval = setInterval(tick, 1000);
  }

  document.querySelectorAll('.fundraising-widget').forEach(renderWidget);
})();
