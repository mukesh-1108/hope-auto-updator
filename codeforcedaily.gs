function fetchCodeforcesDaily() {

  const SHEET_NAME = "MUKESH S_ADS_TECH";
  const HANDLE = "mukeshsads1108";
  const PLATFORM = "Codeforces";
  const DATA_START_ROW = 14;

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAME);

  if (!sheet) throw new Error("Sheet not found");

  const lastRow = sheet.getLastRow();

  const existingIds = new Set();

  if (lastRow >= DATA_START_ROW) {
    const ids = sheet
      .getRange(DATA_START_ROW, 7, lastRow - DATA_START_ROW + 1, 1)
      .getValues()
      .flat()
      .filter(Boolean);

    ids.forEach(id => existingIds.add(id));
  }

  let lastCount = 0;
  if (lastRow >= DATA_START_ROW) {
    lastCount = sheet.getRange(lastRow, 6).getValue() || 0;
  }


  const response = UrlFetchApp.fetch(
    `https://codeforces.com/api/user.status?handle=${HANDLE}`
  );

  const data = JSON.parse(response.getContentText());

  if (data.status !== "OK") {
    throw new Error("Codeforces API error");
  }

  const submissions = data.result;

  submissions.sort((a, b) => a.creationTimeSeconds - b.creationTimeSeconds);

  submissions.forEach(sub => {

    if (sub.verdict !== "OK") return;
    if (existingIds.has(sub.id)) return;

    const dateStr = Utilities.formatDate(
      new Date(sub.creationTimeSeconds * 1000),
      Session.getScriptTimeZone(),
      "dd-MM-yyyy"
    );

    const link = `https://codeforces.com/problemset/problem/${sub.problem.contestId}/${sub.problem.index}`;

    let difficulty = "Medium";

    const rating = sub.problem.rating;

    if (rating) {
      if (rating <= 1200) {
        difficulty = "Easy";
      } else if (rating <= 1700) {
        difficulty = "Medium";
      } else {
        difficulty = "Hard";
      }
    }

    lastCount++;

    sheet.appendRow([
      dateStr,
      sub.problem.name,
      link,
      difficulty,
      PLATFORM,
      lastCount,
      sub.id
    ]);

  });

  Logger.log("✅ Codeforces sync complete with difficulty mapping");
}