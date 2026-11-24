/*
  ========================================================
  GOFUNDME CAMPAIGN CONFIG — used by index.html and donate.html
  ========================================================

  Fill in gofundmeUrl once the GoFundMe campaign is live, then push
  the change (or just ask Claude to do it). The countdown on the
  homepage and Donate page will switch over automatically to the
  live progress bar and a "Donate on GoFundMe" button.

  raised / goal can be updated by hand any time you want the
  progress bar to reflect the latest GoFundMe total. Once the
  campaign is live, GoFundMe also offers its own embeddable widget
  (campaign dashboard > Share > Embed) that updates itself with no
  manual work — ask Claude to swap that in instead if you'd rather
  not update these two numbers by hand.
*/

const GOFUNDME_CAMPAIGN = {
  gofundmeUrl: "",                        // e.g. "https://www.gofundme.com/f/your-campaign"
  launchDate: "2026-12-01T00:00:00",      // when donations open
  goal: 0,                                // total fundraising goal, in euros
  raised: 0                               // amount raised so far, in euros
};
