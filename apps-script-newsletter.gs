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

  sheet.appendRow([new Date(), email]);

  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}
