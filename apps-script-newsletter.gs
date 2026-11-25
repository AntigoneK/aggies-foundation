// Paste this into the Apps Script editor for the "Newsletter Subscribers"
// Google Sheet (Extensions > Apps Script). See the setup instructions
// Claude sent for how to deploy it as a Web App.

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var email = (e.parameter.email || '').trim();

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Invalid email' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Skip duplicates
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase() === email.toLowerCase()) {
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'duplicate' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Stamped explicitly in CET/CEST, rather than relying on the
  // spreadsheet's own timezone setting (which Google sets to GMT by
  // default and can make timestamps look several hours off).
  var timestamp = Utilities.formatDate(new Date(), 'Europe/Amsterdam', 'yyyy-MM-dd HH:mm:ss');
  sheet.appendRow([timestamp, email]);

  // A failed welcome email should never stop the signup itself from
  // succeeding, so this is wrapped on its own.
  try {
    sendWelcomeEmail(email);
  } catch (err) {
    Logger.log('Welcome email failed: ' + err);
  }

  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}


// Sends the "thanks for subscribing" email from contact@aggiesfoundation.com.
// That address must already be a verified "Send mail as" alias in the
// Gmail settings of the Google account running this script. See
// README-newsletter.md.
function sendWelcomeEmail(email) {
  GmailApp.sendEmail(email, "Thanks for subscribing to Aggie's Foundation", '', {
    htmlBody: WELCOME_EMAIL_HTML,
    from: 'contact@aggiesfoundation.com',
    name: "Aggie's Foundation"
  });
}

// Keep this in sync with newsletter-thank-you-email.html in the website
// repo if you ever change the design there.
var WELCOME_EMAIL_HTML = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Thanks for subscribing | Aggie's Foundation</title>
</head>
<body style="margin:0; padding:0; background-color:#f1ede5;">

  <!-- Preheader (hidden preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    Thanks for subscribing to updates from Aggie's Foundation in Kumi, Uganda.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1ede5;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; background-color:#ffffff; border-radius:20px; overflow:hidden; font-family:Arial, Helvetica, sans-serif;">

          <!-- LOGO -->
          <tr>
            <td align="center" style="padding:36px 32px 8px;">
              <img src="https://aggiesfoundation.com/logo.PNG" width="64" height="64" alt="Aggie's Foundation logo" style="display:block; border:0;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 32px 24px; font-family:Arial, Helvetica, sans-serif; font-size:18px; font-weight:bold; color:#153f3b;">
              <span style="color:#c76844;">Aggie&rsquo;s</span> Foundation
            </td>
          </tr>

          <!-- HEADING -->
          <tr>
            <td align="center" style="padding:0 32px 4px; font-family:Arial, Helvetica, sans-serif; font-size:26px; line-height:1.3; font-weight:bold; color:#153f3b;">
              Thanks for subscribing!
            </td>
          </tr>

          <!-- BODY COPY -->
          <tr>
            <td style="padding:16px 40px 8px; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:1.6; color:#4e6a67;">
              Hi there,
              <br /><br />
              You're now on the list for occasional updates from Aggie's Foundation: new classrooms, scholarships, dormitory progress, and stories from the children and schools we support in Kumi, Uganda.
              <br /><br />
              Thank you for staying connected with us. It genuinely helps.
            </td>
          </tr>

          <!-- PHOTO -->
          <tr>
            <td style="padding:20px 32px 8px;">
              <img src="https://aggiesfoundation.com/moment-6.jpg" width="496" alt="A full classroom of smiling students in Kumi" style="display:block; width:100%; max-width:496px; height:auto; border:0; border-radius:14px;" />
            </td>
          </tr>

          <!-- CTA BUTTON -->
          <tr>
            <td align="center" style="padding:28px 32px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="#1b615d" style="border-radius:999px;">
                    <a href="https://aggiesfoundation.com/" target="_blank"
                       style="display:inline-block; padding:14px 32px; font-family:Arial, Helvetica, sans-serif; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none; border-radius:999px;">
                      Visit our website
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#1b534f; padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <a href="https://www.instagram.com/aggie.sfoundation" target="_blank" style="display:inline-block; margin:0 6px;">
                      <img src="https://aggiesfoundation.com/insta-Photoroom1.png" width="20" height="20" alt="Instagram" style="display:block; border:0;" />
                    </a>
                    <a href="https://www.facebook.com/p/Aggies-Foundation-61569674120544/" target="_blank" style="display:inline-block; margin:0 6px;">
                      <img src="https://aggiesfoundation.com/facebook-Photoroom1.png" width="20" height="20" alt="Facebook" style="display:block; border:0;" />
                    </a>
                    <a href="https://www.linkedin.com/company/aggie-s-foundation/" target="_blank" style="display:inline-block; margin:0 6px;">
                      <img src="https://aggiesfoundation.com/linkedin-Photoroom.png" width="20" height="20" alt="LinkedIn" style="display:block; border:0;" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:1.6; color:#cfe3e0;">
                    Aggie's Foundation &middot; Kumi, Uganda
                    <br />
                    You're receiving this because you subscribed at aggiesfoundation.com.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
