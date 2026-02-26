function fetchAtCoderDaily() {

  const SHEET_NAME = "MUKESH S_ADS_TECH";
  const HANDLE = "mukesh_1108";   
  const PLATFORM = "AtCoder";
  const DATA_START_ROW = 14;

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAME);

  if (!sheet) throw new Error("Sheet not found");

  const lastRow = sheet.getLastRow();

  const existingLinks = new Set();

  if (lastRow >= DATA_START_ROW) {
    const links = sheet
      .getRange(DATA_START_ROW, 3, lastRow - DATA_START_ROW + 1, 1)
      .getValues()
      .flat()
      .filter(Boolean);

    links.forEach(l => existingLinks.add(l));
  }

  let lastCount = 0;
  if (lastRow >= DATA_START_ROW) {
    lastCount = sheet.getRange(lastRow, 6).getValue() || 0;
  }

  const response = UrlFetchApp.fetch(
    `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${HANDLE}&from_second=0`
  );

  const submissions = JSON.parse(response.getContentText());

  submissions.sort((a, b) => a.epoch_second - b.epoch_second);

  submissions.forEach(sub => {

    if (sub.result !== "AC") return;

    const link = `https://atcoder.jp/contests/${sub.contest_id}/tasks/${sub.problem_id}`;

    if (existingLinks.has(link)) return;

    const dateStr = Utilities.formatDate(
      new Date(sub.epoch_second * 1000),
      Session.getScriptTimeZone(),
      "dd-MM-yyyy"
    );

    lastCount++;

    sheet.appendRow([
      dateStr,
      sub.problem_id,
      link,
      "Medium",  
      PLATFORM,
      lastCount
    ]);
  });

  Logger.log("✅ AtCoder sync complete");
}