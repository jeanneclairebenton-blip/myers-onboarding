/**
 * Myers Home Buyers — Onboarding Sync (Apps Script)
 * 
 * Receives POST data from the onboarding web app and updates
 * the "New Agent Onboarding" sheet + creates a Drive folder per agent.
 * 
 * SETUP:
 *   1. Open your Master_Tracker Google Sheet
 *   2. Extensions → Apps Script
 *   3. Delete any existing code, paste this entire file
 *   4. Click Deploy → Manage deployments → Edit → New version → Deploy
 */

// ── Sheet config ────────────────────────────────────────────────────────────
const ONBOARD_SHEET    = 'New Agent Onboarding';
const ONBOARD_HDR_ROW  = 5;
const ONBOARD_DATA_ROW = 6;

// Admin email — receives a report every time an agent submits
const ADMIN_EMAIL = 'jeanne@myershomebuyers.com'; // ← Change this to your email

// Agent info columns (matching actual sheet)
const COL_NAME     = 1;   // A - Name
const COL_TITLE    = 2;   // B - Title
const COL_PHONE    = 3;   // C - Phone Number
const COL_EMAIL    = 4;   // D - Email
const COL_NOTES    = 5;   // E - Notes
const COL_LICENSE  = 6;   // F - License #
const COL_REFER    = 7;   // G - Referring Agent
const COL_START    = 10;  // J - Start Date Recorded

// Task → column mappings (matching actual sheet headers)
const TASK_MAP = {
  '_paperwork_all':      11,  // K  - ICA / W9 / CC Auth
  'gmail-setup':         15,  // O  - Gmail Activated
  'zoho-crm':            16,  // P  - Zoho Activated
  'slack':               17,  // Q  - Slack Activated
  'first-meeting':       20,  // T  - Add To Team Roster
  'calendars':           22,  // V  - Add to Company Calendar + Showings Calendar
  'welcome-post':        26,  // Z  - Welcome to Myers Post
  'deal-walkthrough':    27,  // AA - Zoho: Deals & MVP
  'deal-walkthrough-2':  28,  // AB - Zoho + Gmail Integration
  'slack_resources':     29,  // AC - Slack Resources + Add to Group
  'email-sig':           30,  // AD - Gmail + Gmail Signature
  'cards':               31,  // AE - Marketing SetUp: Business Cards + Flyers
  'cc-auth':             11,  // K  - same as paperwork column
  'payout-review':       32,  // AF - Payroll
};

// Marketing selection columns (after existing columns)
const COL_WELCOME_TEMPLATE = 33;  // AG - Welcome Template choice
const COL_CARD_STYLE       = 34;  // AH - Business Card style
const COL_DRIVE_FOLDER     = 35;  // AI - Drive folder link

// Paperwork task IDs (all 3 needed to mark column K)
const PAPERWORK_IDS = ['sponsorship', 'w9', 'cc-auth'];

// Drive folder name for agent folders
const RECRUITING_FOLDER_NAME = '2026 Recruiting';


// ── Main handler ────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(ONBOARD_SHEET);
    if (!sheet) return jsonResponse({ success: false, error: 'Sheet not found: ' + ONBOARD_SHEET });
    
    var agent = data.agent || {};
    var taskId = data.taskId || null;
    var completed = data.completed !== false;
    var allProgress = data.allProgress || {};
    var syncType = data.type || 'task';
    
    var email = (agent.email || '').trim().toLowerCase();
    if (!email) return jsonResponse({ success: false, error: 'No agent email provided' });
    
    // ── Find or create agent row ─────────────────────────────────────────
    var rowIdx = findRowByEmail(sheet, COL_EMAIL, ONBOARD_DATA_ROW, email);
    var isNew = (rowIdx === -1);
    if (isNew) {
      rowIdx = findNextEmptyRow(sheet, COL_NAME, ONBOARD_DATA_ROW);
    }
    
    // ── Fill agent info ──────────────────────────────────────────────────
    if (syncType === 'profile' || syncType === 'full' || isNew) {
      sheet.getRange(rowIdx, COL_NAME).setValue(agent.fullName || '');
      sheet.getRange(rowIdx, COL_PHONE).setValue(agent.phone || '');
      sheet.getRange(rowIdx, COL_EMAIL).setValue(agent.email || '');
      if (agent.title) sheet.getRange(rowIdx, COL_TITLE).setValue(agent.title);
      if (agent.license) sheet.getRange(rowIdx, COL_LICENSE).setValue(agent.license);
      if (isNew) sheet.getRange(rowIdx, COL_START).setValue(new Date());
      
      // Add headers for new columns if they don't exist yet
      ensureHeaders(sheet);
    }
    
    // ── Sync individual task ─────────────────────────────────────────────
    if (syncType === 'task' && taskId) {
      markTask(sheet, rowIdx, taskId, completed, allProgress);
    }
    
    // ── Full sync — update all tasks + marketing + photos ────────────────
    if (syncType === 'full') {
      // Mark all completed tasks
      for (var tid in allProgress) {
        if (allProgress[tid]) {
          markTask(sheet, rowIdx, tid, true, allProgress);
        }
      }
      
      // Save marketing selections to sheet
      if (data.marketing) {
        if (data.marketing.welcomeTemplate) {
          sheet.getRange(rowIdx, COL_WELCOME_TEMPLATE).setValue(data.marketing.welcomeTemplate);
        }
        if (data.marketing.cardStyle) {
          sheet.getRange(rowIdx, COL_CARD_STYLE).setValue(data.marketing.cardStyle);
        }
      }
      
      // Create Drive folder and save photos
      if (data.photo || (data.marketing && data.marketing.welcomeImage)) {
        var folderUrl = saveToDrive(agent, data.photo, data.marketing);
        if (folderUrl) {
          sheet.getRange(rowIdx, COL_DRIVE_FOLDER).setValue(folderUrl);
        }
      }
      
      // Send email report to admin
      try {
        sendEmailReport(agent, allProgress, data.marketing || {});
      } catch (emailErr) {
        Logger.log('Email report error: ' + emailErr.toString());
      }
    }
    
    return jsonResponse({
      success: true,
      row: rowIdx,
      isNew: isNew,
      timestamp: new Date().toISOString(),
    });
    
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  return jsonResponse({
    status: 'ok',
    message: 'Myers Onboarding Sync is running. Use POST to send data.',
    timestamp: new Date().toISOString(),
  });
}


// ── Ensure new column headers exist ─────────────────────────────────────────
function ensureHeaders(sheet) {
  var hdrRow = ONBOARD_HDR_ROW;
  if (!sheet.getRange(hdrRow, COL_WELCOME_TEMPLATE).getValue()) {
    sheet.getRange(hdrRow, COL_WELCOME_TEMPLATE).setValue('Welcome Template');
  }
  if (!sheet.getRange(hdrRow, COL_CARD_STYLE).getValue()) {
    sheet.getRange(hdrRow, COL_CARD_STYLE).setValue('Card Style');
  }
  if (!sheet.getRange(hdrRow, COL_DRIVE_FOLDER).getValue()) {
    sheet.getRange(hdrRow, COL_DRIVE_FOLDER).setValue('Agent Drive Folder');
  }
}


// ── Save photos/files to Google Drive ───────────────────────────────────────
function saveToDrive(agent, photoBase64, marketing) {
  try {
    // Find the "2026 Recruiting" folder
    var recruitFolders = DriveApp.getFoldersByName(RECRUITING_FOLDER_NAME);
    var parentFolder;
    if (recruitFolders.hasNext()) {
      parentFolder = recruitFolders.next();
    } else {
      // Create it if it doesn't exist
      parentFolder = DriveApp.createFolder(RECRUITING_FOLDER_NAME);
    }
    
    // Create or find agent folder inside 2026 Recruiting
    var agentName = (agent.fullName || 'Unknown Agent').trim();
    var agentFolder;
    var existingFolders = parentFolder.getFoldersByName(agentName);
    if (existingFolders.hasNext()) {
      agentFolder = existingFolders.next();
    } else {
      agentFolder = parentFolder.createFolder(agentName);
    }
    
    // Save headshot photo
    if (photoBase64) {
      saveBase64File(agentFolder, photoBase64, agentName + ' - Headshot', 'headshot');
    }
    
    // Save welcome post image if available
    if (marketing && marketing.welcomeImage) {
      var templateName = marketing.welcomeTemplate || 'welcome';
      saveBase64File(agentFolder, marketing.welcomeImage, agentName + ' - Welcome Post (' + templateName + ')', 'welcome');
    }
    
    return agentFolder.getUrl();
    
  } catch (err) {
    Logger.log('Drive save error: ' + err.toString());
    return null;
  }
}

function saveBase64File(folder, base64Data, fileName, prefix) {
  try {
    // Parse data URL: data:image/png;base64,xxxxx
    var parts = base64Data.split(',');
    var mimeMatch = parts[0].match(/data:(.*?);/);
    var mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    var extension = mimeType.split('/')[1] || 'png';
    if (extension === 'jpeg') extension = 'jpg';
    var rawBase64 = parts.length > 1 ? parts[1] : parts[0];
    
    var blob = Utilities.newBlob(Utilities.base64Decode(rawBase64), mimeType, fileName + '.' + extension);
    
    // Remove old file with same prefix if it exists (so re-uploads replace)
    var existing = folder.getFilesByName(fileName + '.' + extension);
    while (existing.hasNext()) {
      existing.next().setTrashed(true);
    }
    
    folder.createFile(blob);
  } catch (err) {
    Logger.log('File save error for ' + prefix + ': ' + err.toString());
  }
}


// ── Mark a task in the sheet ────────────────────────────────────────────────
function markTask(sheet, rowIdx, taskId, completed, allProgress) {
  var mark = completed ? '✓' : '';
  
  // Handle paperwork tasks specially (column J needs all 3)
  if (PAPERWORK_IDS.indexOf(taskId) !== -1) {
    var allPaperwork = PAPERWORK_IDS.every(function(id) { return allProgress[id]; });
    if (allPaperwork && TASK_MAP['_paperwork_all']) {
      sheet.getRange(rowIdx, TASK_MAP['_paperwork_all']).setValue('✓');
    } else if (TASK_MAP['_paperwork_all']) {
      var count = PAPERWORK_IDS.filter(function(id) { return allProgress[id]; }).length;
      if (count > 0) {
        sheet.getRange(rowIdx, TASK_MAP['_paperwork_all']).setValue(count + '/3');
      }
    }
    // Also mark CC Auth → Payment Form column
    if (taskId === 'cc-auth' && TASK_MAP['cc-auth']) {
      sheet.getRange(rowIdx, TASK_MAP['cc-auth']).setValue(mark);
    }
    return;
  }
  
  // Direct task mapping
  if (TASK_MAP[taskId]) {
    sheet.getRange(rowIdx, TASK_MAP[taskId]).setValue(mark);
  }
  
  // Tasks that map to multiple columns
  if (taskId === 'slack' && TASK_MAP['slack_resources']) {
    sheet.getRange(rowIdx, TASK_MAP['slack_resources']).setValue(mark);
  }
  if (taskId === 'deal-walkthrough' && TASK_MAP['deal-walkthrough-2']) {
    sheet.getRange(rowIdx, TASK_MAP['deal-walkthrough-2']).setValue(mark);
  }
}


// ── Helpers ──────────────────────────────────────────────────────────────────
function findRowByEmail(sheet, emailCol, startRow, email) {
  var lastRow = sheet.getLastRow();
  if (lastRow < startRow) return -1;
  
  var range = sheet.getRange(startRow, emailCol, lastRow - startRow + 1, 1);
  var values = range.getValues();
  
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] && values[i][0].toString().trim().toLowerCase() === email) {
      return startRow + i;
    }
  }
  return -1;
}

function findNextEmptyRow(sheet, nameCol, startRow) {
  var lastRow = sheet.getLastRow();
  if (lastRow < startRow) return startRow;
  
  var range = sheet.getRange(startRow, nameCol, lastRow - startRow + 2, 1);
  var values = range.getValues();
  
  for (var i = 0; i < values.length; i++) {
    if (!values[i][0] || values[i][0].toString().trim() === '') {
      return startRow + i;
    }
  }
  return lastRow + 1;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


// ── Email Report ────────────────────────────────────────────────────────────
function sendEmailReport(agent, allProgress, marketing) {
  if (!ADMIN_EMAIL) return;
  
  var agentName = agent.fullName || (agent.first + ' ' + agent.last) || 'Unknown';
  var subject = '📋 New Onboarding Submission: ' + agentName;
  
  // Build task status lists
  var allTasks = [
    { id: 'sponsorship', label: 'Sponsorship Agreement (ICA)' },
    { id: 'w9', label: 'W-9 Form' },
    { id: 'cc-auth', label: 'Credit Card Authorization' },
    { id: 'license-transfer', label: 'License Transfer to TREC' },
    { id: 'gmail-setup', label: 'Gmail Activated' },
    { id: 'calendars', label: 'Joined Shared Calendars' },
    { id: 'shared-drives', label: 'Joined Shared Drives' },
    { id: 'slack', label: 'Joined Slack' },
    { id: 'zoho-crm', label: 'Zoho CRM Activated' },
    { id: 'zip-forms', label: 'Zip Forms Setup' },
    { id: 'forewarn', label: 'ForeWarn Setup' },
    { id: 'brand-guidelines', label: 'Brand Guidelines Reviewed' },
    { id: 'welcome-post', label: 'Welcome Announcement Created' },
    { id: 'email-sig', label: 'Email Signature Setup' },
    { id: 'cards', label: 'Business Cards Designed' },
    { id: 'website', label: 'Carrot Website Requested' },
    { id: 'social-kit', label: 'Social Brand Kit Downloaded' },
    { id: 'normal-payout', label: 'Normal Payout Policy Reviewed' },
    { id: 'expedited-payout', label: 'Expedited Payout Policy Reviewed' },
    { id: 'revshare-payout', label: 'Rev Share Policy Reviewed' },
    { id: 'payout-review', label: 'Payout Policies Acknowledged' },
  ];
  
  var completedHtml = '';
  var incompleteHtml = '';
  var completedCount = 0;
  
  for (var i = 0; i < allTasks.length; i++) {
    var t = allTasks[i];
    if (allProgress[t.id]) {
      completedHtml += '<li style="color:#2d6a2d;padding:4px 0;">✅ ' + t.label + '</li>';
      completedCount++;
    } else {
      incompleteHtml += '<li style="color:#999;padding:4px 0;">⬜ ' + t.label + '</li>';
    }
  }
  
  var totalTasks = allTasks.length;
  var pct = Math.round((completedCount / totalTasks) * 100);
  
  // Marketing selections
  var marketingHtml = '';
  if (marketing.welcomeTemplate) {
    marketingHtml += '<tr><td style="padding:8px 12px;font-weight:600;color:#666;">Welcome Template</td><td style="padding:8px 12px;">' + marketing.welcomeTemplate + '</td></tr>';
  }
  if (marketing.cardStyle) {
    marketingHtml += '<tr><td style="padding:8px 12px;font-weight:600;color:#666;">Card Style</td><td style="padding:8px 12px;">' + marketing.cardStyle + '</td></tr>';
  }
  
  var html = ''
    + '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">'
    + '<div style="background:#C9941F;color:#fff;padding:24px 32px;border-radius:8px 8px 0 0;">'
    + '<h1 style="margin:0;font-size:22px;">🏠 Myers Agent Onboarding Report</h1>'
    + '<p style="margin:8px 0 0;opacity:0.9;">New submission received ' + new Date().toLocaleDateString() + '</p>'
    + '</div>'
    
    + '<div style="padding:24px 32px;border:1px solid #e0e0e0;border-top:none;">'
    
    // Agent Info
    + '<h2 style="font-size:16px;color:#C9941F;border-bottom:2px solid #f0e6c8;padding-bottom:8px;">Agent Information</h2>'
    + '<table style="width:100%;border-collapse:collapse;margin-bottom:24px;">'
    + '<tr><td style="padding:8px 12px;font-weight:600;color:#666;width:140px;">Name</td><td style="padding:8px 12px;">' + agentName + '</td></tr>'
    + '<tr style="background:#faf7f0;"><td style="padding:8px 12px;font-weight:600;color:#666;">Email</td><td style="padding:8px 12px;">' + (agent.email || 'Not provided') + '</td></tr>'
    + '<tr><td style="padding:8px 12px;font-weight:600;color:#666;">Phone</td><td style="padding:8px 12px;">' + (agent.phone || 'Not provided') + '</td></tr>'
    + '<tr style="background:#faf7f0;"><td style="padding:8px 12px;font-weight:600;color:#666;">Title</td><td style="padding:8px 12px;">' + (agent.title || 'Not provided') + '</td></tr>'
    + '<tr><td style="padding:8px 12px;font-weight:600;color:#666;">License #</td><td style="padding:8px 12px;">' + (agent.license || 'Not provided') + '</td></tr>'
    + '</table>'
    
    // Progress Bar
    + '<h2 style="font-size:16px;color:#C9941F;border-bottom:2px solid #f0e6c8;padding-bottom:8px;">Progress: ' + completedCount + '/' + totalTasks + ' (' + pct + '%)</h2>'
    + '<div style="background:#e0e0e0;border-radius:8px;height:20px;margin-bottom:16px;overflow:hidden;">'
    + '<div style="background:#C9941F;height:100%;width:' + pct + '%;border-radius:8px;"></div>'
    + '</div>'
    
    // Completed Tasks
    + '<h3 style="font-size:14px;color:#2d6a2d;">✅ Completed (' + completedCount + ')</h3>'
    + '<ul style="list-style:none;padding:0;margin:0 0 16px;">' + completedHtml + '</ul>'
    
    // Incomplete Tasks
    + '<h3 style="font-size:14px;color:#999;">⬜ Not Yet Completed (' + (totalTasks - completedCount) + ')</h3>'
    + '<ul style="list-style:none;padding:0;margin:0 0 16px;">' + incompleteHtml + '</ul>'
    
    // Marketing Selections
    + (marketingHtml ? '<h2 style="font-size:16px;color:#C9941F;border-bottom:2px solid #f0e6c8;padding-bottom:8px;">Marketing Selections</h2>'
    + '<table style="width:100%;border-collapse:collapse;margin-bottom:24px;">' + marketingHtml + '</table>' : '')
    
    + '<div style="margin-top:24px;padding:16px;background:#faf7f0;border-radius:8px;text-align:center;color:#666;font-size:13px;">'
    + 'This report was auto-generated by the Myers Onboarding System'
    + '</div>'
    
    + '</div></div>';
  
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: subject,
    htmlBody: html,
  });
  
  Logger.log('Email report sent for: ' + agentName);
}
