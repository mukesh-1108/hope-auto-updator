function fetchLeetCodeDaily() {

  const SHEET_NAME = "MUKESH S_ADS_TECH";
  const USERNAME = "SNLJNeTxe9";
  const PLATFORM = "LeetCode";

  const TABLE_HEADER_ROW = 13;
  const DATA_START_ROW = 14;

  const INITIAL_SYNC = false; 
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAME);

  if (!sheet) throw new Error("Sheet not found");

  const lastRow = sheet.getLastRow();

  if (INITIAL_SYNC && lastRow >= DATA_START_ROW) {
    sheet
      .getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, 6)
      .clearContent();
  }

  const existingRows = sheet.getLastRow() >= DATA_START_ROW
    ? sheet.getRange(DATA_START_ROW, 2, sheet.getLastRow() - DATA_START_ROW + 1, 2).getValues()
    : [];

  const existingLinks = new Set(
    existingRows.map(r => r[1]).filter(Boolean)
  );

  let lastCount = 0;
  if (!INITIAL_SYNC && sheet.getLastRow() >= DATA_START_ROW) {
    lastCount = sheet.getRange(sheet.getLastRow(), 6).getValue() || 0;
  }
  const recentQuery = `
    query recentAcSubmissions($username: String!) {
      recentAcSubmissionList(username: $username, limit: 50) {
        title
        titleSlug
        timestamp
      }
    }
  `;

  const response = UrlFetchApp.fetch("https://leetcode.com/graphql", {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      query: recentQuery,
      variables: { username: USERNAME }
    })
  });

  const submissions = JSON.parse(response.getContentText())
    .data.recentAcSubmissionList
    .sort((a, b) => a.timestamp - b.timestamp);

 
  submissions.forEach(problem => {

    const link = `https://leetcode.com/problems/${problem.titleSlug}`;
    if (!INITIAL_SYNC && existingLinks.has(link)) return;

    const diffQuery = `
      query getQuestion($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          difficulty
        }
      }
    `;

    const diffRes = UrlFetchApp.fetch("https://leetcode.com/graphql", {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        query: diffQuery,
        variables: { titleSlug: problem.titleSlug }
      })
    });

    const difficulty = JSON.parse(diffRes.getContentText())
      .data.question.difficulty;

    const dateOnly = Utilities.formatDate(
      new Date(problem.timestamp * 1000),
      Session.getScriptTimeZone(),
      "dd-MM-yyyy"
    );

    lastCount++;

    sheet.appendRow([
      dateOnly,
      problem.title,
      link,
      difficulty,
      PLATFORM,
      lastCount
    ]);
  });

  Logger.log("✅ Sync complete");
}
