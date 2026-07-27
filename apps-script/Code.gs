// ============================================================
// Water Laboratory Visitor Management — Google Apps Script
// ------------------------------------------------------------
// This script turns a Google Sheet into the database for the
// visitor management web app. It exposes a Web App endpoint
// that accepts POST requests with JSON bodies.
//
// SETUP
//   1. Create a new Google Sheet (any name).
//   2. Extensions > Apps Script. Paste this file into Code.gs.
//   3. (Optional) Set SHEET_NAME below to your preferred tab name.
//   4. Deploy > New deployment > "Web app".
//        - Execute as: Me
//        - Who has access: Anyone
//   5. Copy the deployment URL (ends with /exec).
//   6. Paste it into src/config/app.config.ts as GOOGLE_SCRIPT_URL.
// ============================================================

var SHEET_NAME = 'Visitors';

var HEADERS = [
  'visitorId', 'firstName', 'lastName', 'nationalId', 'phone', 'email',
  'company', 'department', 'employee', 'purpose', 'visitDate',
  'arrivalTime', 'qrUrl', 'status', 'timestamp'
];

// ---------- Sheet helpers ----------

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function rowsToObjects(rows) {
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (!row[0]) continue;
    var obj = {};
    for (var j = 0; j < HEADERS.length; j++) {
      obj[HEADERS[j]] = row[j] || '';
    }
    out.push(obj);
  }
  return out;
}

function findRowByVisitorId(sheet, visitorId) {
  var ids = sheet.getRange(2, 1, sheet.getLastRow() - 1 || 0, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === visitorId) return i + 2; // +2 for header + 0-index
  }
  return -1;
}

// ---------- Visitor ID generation ----------

function nextVisitorId() {
  var sheet = getSheet();
  var year = new Date().getFullYear();
  var prefix = 'LAB-' + year + '-';
  var maxSeq = 0;
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      var id = String(ids[i][0] || '');
      if (id.indexOf(prefix) === 0) {
        var seq = parseInt(id.substring(prefix.length), 10);
        if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
      }
    }
  }
  var next = maxSeq + 1;
  return prefix + ('000000' + next).slice(-6);
}

// ---------- Actions ----------

function register(payload) {
  var sheet = getSheet();
  var row = [
    payload.visitorId, payload.firstName, payload.lastName,
    payload.nationalId, payload.phone, payload.email, payload.company,
    payload.department, payload.employee, payload.purpose,
    payload.visitDate, payload.arrivalTime, payload.qrUrl,
    payload.status || 'Pending', payload.timestamp || new Date().toISOString()
  ];
  sheet.appendRow(row);
  return rowsToObjects([HEADERS, row])[0];
}

function listVisitors() {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var rows = sheet.getRange(1, 1, lastRow, HEADERS.length).getValues();
  return rowsToObjects(rows);
}

function getVisitor(visitorId) {
  var sheet = getSheet();
  var rowIdx = findRowByVisitorId(sheet, visitorId);
  if (rowIdx === -1) return null;
  var row = sheet.getRange(rowIdx, 1, 1, HEADERS.length).getValues()[0];
  var obj = {};
  for (var j = 0; j < HEADERS.length; j++) obj[HEADERS[j]] = row[j] || '';
  return obj;
}

function updateVisitor(visitor) {
  var sheet = getSheet();
  var rowIdx = findRowByVisitorId(sheet, visitor.visitorId);
  if (rowIdx === -1) return null;
  var row = [];
  for (var j = 0; j < HEADERS.length; j++) {
    row.push(visitor[HEADERS[j]] !== undefined ? visitor[HEADERS[j]] : '');
  }
  sheet.getRange(rowIdx, 1, 1, HEADERS.length).setValues([row]);
  var obj = {};
  for (var j = 0; j < HEADERS.length; j++) obj[HEADERS[j]] = row[j];
  return obj;
}

function deleteVisitor(visitorId) {
  var sheet = getSheet();
  var rowIdx = findRowByVisitorId(sheet, visitorId);
  if (rowIdx === -1) return false;
  sheet.deleteRow(rowIdx);
  return true;
}

function setStatus(visitorId, status) {
  var sheet = getSheet();
  var rowIdx = findRowByVisitorId(sheet, visitorId);
  if (rowIdx === -1) return null;
  var statusCol = HEADERS.indexOf('status') + 1;
  sheet.getRange(rowIdx, statusCol).setValue(status);
  return getVisitor(visitorId);
}

// ---------- Web App entry point ----------

function doPost(e) {
  var response;
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;

    switch (action) {
      case 'register':
        response = { success: true, data: register(body.payload) };
        break;
      case 'list':
        response = { success: true, data: listVisitors() };
        break;
      case 'get':
        response = { success: true, data: getVisitor(body.visitorId) };
        break;
      case 'update':
        response = { success: true, data: updateVisitor(body.visitor) };
        break;
      case 'delete':
        response = { success: deleteVisitor(body.visitorId) };
        break;
      case 'nextId':
        response = { success: true, data: { visitorId: nextVisitorId() } };
        break;
      case 'setStatus':
        response = { success: true, data: setStatus(body.visitorId, body.status) };
        break;
      default:
        response = { success: false, error: 'Unknown action: ' + action };
    }
  } catch (err) {
    response = { success: false, error: String(err) };
  }
  return json(response);
}

// Support GET for quick health checks / CORS preflight.
function doGet() {
  return json({ success: true, message: 'Najran Central Laboratory Visitor API is running.' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
