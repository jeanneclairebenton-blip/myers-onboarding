# 🔗 How to Connect Your Onboarding App to Google Sheets

## Step 1: Open Your Master_Tracker Sheet

1. Go to **Google Drive** → **2026 Recruiting** folder
2. Open **Master_Tracker**

## Step 2: Open Apps Script

1. In the sheet, click **Extensions** → **Apps Script**
2. This opens a code editor in a new tab

## Step 3: Paste the Script

1. **Delete** any existing code in the editor (select all → delete)
2. Open the file `Code.gs` (it's in your Downloads/Onbarding folder)
3. Copy **all** the code and paste it into the Apps Script editor
4. Click the **💾 Save** button (or Ctrl+S)

## Step 4: Deploy as Web App

1. Click **Deploy** → **New deployment** (top right)
2. Click the ⚙️ gear icon next to "Select type" → choose **Web app**
3. Fill in:
   - **Description**: "Onboarding Sync"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** → Choose your Google account → Click "Allow"
   - If you see a "This app isn't verified" warning, click **Advanced** → **Go to Untitled project (unsafe)** → **Allow**
6. **Copy the Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/ABCDEFG.../exec
   ```

## Step 5: Paste the URL into the App

1. Open `app.jsx` in your Onbarding folder
2. Find this line near the top:
   ```javascript
   const SHEET_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `PASTE_YOUR_APPS_SCRIPT_URL_HERE` with the URL you copied
4. Save the file

## ✅ Done!

Now when agents use the onboarding checklist:
- Their info (name, email, phone, license) auto-fills in both sheets
- Each task they complete marks a ✓ in the corresponding column
- The Start Date auto-fills when they first appear

## Troubleshooting

- **"Script function not found"**: Make sure you saved the code and redeployed
- **Nothing happening**: Check that the URL in `app.jsx` matches exactly (no extra spaces)
- **Permission error**: Re-deploy and make sure "Who has access" is set to "Anyone"
- **Need to update the script later**: After editing Code.gs, you must do **Deploy → Manage deployments → Edit (pencil icon) → Version: New version → Deploy** to push changes live
