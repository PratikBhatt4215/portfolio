## Step 1: Set Up Column Headers in Google Sheet
In Row 1 of your Google Sheet (`Portfolio DB`), add these column headers in **Row 1**:
- **Column A**: `Timestamp`
- **Column B**: `Name`
- **Column C**: `Email`
- **Column D**: `Project Type`
- **Column E**: `Message`

---

## Step 2: Paste Google Apps Script Code
In your Google Sheet, click **Extensions** > **Apps Script**, replace `Code.gs` with this script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Automatically add Header Row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email", "Project Type", "Message"]);
    }
    
    var data = e.parameter;
    if (!data || !data.name) {
      data = JSON.parse(e.postData.contents);
    }
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.name,
      data.email,
      data.projectType,
      data.message
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## Step 3: Deploy as Web App
1. Click **Deploy** > **New deployment** at top right.
2. Select type: **Web app**.
3. Set **Execute as**: `Me`.
4. Set **Who has access**: `Anyone`.
5. Click **Deploy** and authorize permissions when prompted.
6. Copy the **Web App URL** provided (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).
7. Open [ContactForm.jsx](file:///Users/pratikkumar/Portfolio/src/components/ContactForm.jsx) and your URL is configured to: `https://script.google.com/macros/s/AKfycbwvdNaPIC_rI-xGQbCYkE9bUtKY3XyyYkcNVoH0eBB2HCXYrSSLwHIDS-j1_yFnAKHy/exec`!
