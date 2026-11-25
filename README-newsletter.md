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

The email is sent **from contact@aggiesfoundation.com**. For that to
happen automatically, the script itself needs to run as that account,
not your personal one. That means sharing the sheet with
contact@aggiesfoundation.com and deploying from inside that account:

1. Open the **Newsletter Subscribers** spreadsheet from your personal
   account (as usual) and click **Share**. Add
   `contact@aggiesfoundation.com` with **Editor** access, then send.
2. Log into Google as `contact@aggiesfoundation.com` (use a private/
   incognito window, or sign out of your personal account first).
3. Still signed in as contact@, open the same **Newsletter Subscribers**
   spreadsheet (it now shows up under "Shared with me," or search for
   it). Go to **Extensions → Apps Script**. You'll see the same script
   code already there, since it belongs to the spreadsheet, not to
   either account. If you want to double check, it should match the
   current contents of `apps-script-newsletter.gs`.
4. Click **Deploy → New deployment → Web app**, and set:
   - **Execute as:** Me (this time, "Me" is contact@aggiesfoundation.com)
   - **Who has access:** Anyone
5. Click **Deploy**. Google will ask contact@ to authorize the script,
   including permission to send email as that account. This is the
   one-time consent click, same idea as the original setup, just done
   under the contact@ login this time.
6. Copy the new **Web app URL** (ends in `/exec`) and send it over so
   `newsletter.js` can be pointed at it.

The old deployment (the one created under your personal account) can
just be left alone or archived later. It's not doing any harm sitting
there unused.

If this step hasn't been done yet, signups still work and still get
saved to the sheet. The welcome email just doesn't send until the new
deployment exists, so nothing breaks in the meantime.
