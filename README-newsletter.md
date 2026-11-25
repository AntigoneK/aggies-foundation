# Newsletter signup setup (one time)

The "Stay in touch" form in the site footer collects an email address and
sends it to a Google Sheet, via a small Google Apps Script "Web App"
acting as the bridge (static sites like this one can't talk to Google
Sheets directly).

The sheet already exists: **Newsletter Subscribers**, inside the
`Aggie's foundation 2026` Drive folder.

## One-time setup (do this once)

1. Open the **Newsletter Subscribers** spreadsheet.
2. Go to **Extensions → Apps Script**.
3. Delete any starter code in the editor, and paste in the contents of
   `apps-script-newsletter.gs` (in this same folder).
4. Click **Deploy → New deployment**.
5. Next to "Select type", click the gear icon and choose **Web app**.
6. Set:
   - **Execute as:** Me (your Google account)
   - **Who has access:** Anyone
7. Click **Deploy**. Google will ask you to authorize the script.
   This is the one step only you can do. It's a security check Google
   requires for any script that becomes a public endpoint.
8. Copy the **Web app URL** it gives you (ends in `/exec`).
9. Send that URL back. It gets pasted into one line of `newsletter.js`
   (the `ENDPOINT` constant near the top), and the signup form goes live
   on the next deploy.

## Changing anything later

- To see subscribers: just open the Newsletter Subscribers sheet.
- If you ever edit the Apps Script code, you need to create a **new
  deployment** (Deploy → Manage deployments → pencil icon → New version)
  for the change to take effect. Saving the code alone isn't enough.
- The deployment URL stays the same across new versions, so no website
  change is needed when you update the script itself.

## Signup timestamps

Each row's timestamp is stamped by the script in Central European Time
(Europe/Amsterdam), so it reflects when the signup actually happened in
your timezone, regardless of the spreadsheet's own timezone setting.

To pick up this fix, open the Apps Script editor, replace the code with
the current contents of `apps-script-newsletter.gs`, and create a new
deployment (see "Changing anything later" above). Rows recorded before
that will keep their old (possibly off-by-a-few-hours) timestamps.

## Thank-you email (sends automatically on signup)

Every new subscriber now also gets an automatic "Thanks for subscribing"
email, styled to match the site (logo, colors, a photo, a button back to
aggiesfoundation.com). The design lives in `newsletter-thank-you-email.html`
in this same folder, in case you want to preview or tweak it. It's also
copied into `apps-script-newsletter.gs` as the `WELCOME_EMAIL_HTML`
constant, since that's what the script actually sends. If you change one,
change the other to match.

The email is sent **from contact@aggiesfoundation.com**, using it as a
verified **"Send mail as"** alias in the Gmail settings of your
personal Google account (the one that owns the Newsletter Subscribers
sheet). Since contact@ is hosted outside Google (through EuroDNS's
Open-Xchange email), this alias is what lets Gmail send under that
name without needing to log into a separate Google account.

Once that alias shows as verified under Gmail → Settings → Accounts
and Import → Send mail as:

1. Paste the current `apps-script-newsletter.gs` into the Apps Script
   editor for the Newsletter Subscribers sheet (replacing what's there).
2. Create a **new deployment** (see "Changing anything later" above).
3. The first time this runs, Google will ask you to re-authorize the
   script, this time including permission to send email. Same kind of
   one-time consent click as the original setup.

If the alias isn't verified yet, signups still work and still get
saved to the sheet. The welcome email just silently fails to send
until it is, so nothing breaks in the meantime.
