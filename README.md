🧠 Competitive Programming Multi-Platform Auto Tracker
📌 Overview

This project is a fully automated competitive programming tracker that synchronizes accepted problem submissions from:

🟢 LeetCode (GraphQL API)

🔵 Codeforces (Official REST API)

🟣 AtCoder (Public JSON API Mirror)

All solved problems are consolidated into a structured Google Sheets dashboard using Google Apps Script with scheduled time-driven triggers.

The system ensures:

No duplicate entries

Continuous cumulative count

Platform-based tagging

Automatic difficulty classification

Fully automated daily sync

🏗️ System Architecture
LeetCode GraphQL API
        ↓
Codeforces REST API
        ↓
AtCoder Public API
        ↓
Google Apps Script (Serverless Automation)
        ↓
Google Sheets Dashboard
⚙️ Core Design Principles
1️⃣ Idempotent Syncing

Each run:

Fetches latest submissions

Skips already recorded entries

Appends only new records

This guarantees safe repeated execution.

2️⃣ Duplicate Prevention Strategy
Platform	Unique Identifier Used
LeetCode	Problem Link
Codeforces	Submission ID
AtCoder	Submission ID

Using submission IDs prevents duplicate insertion even if:

The same problem is solved multiple times

Script runs multiple times per day

API returns historical data

3️⃣ Difficulty Normalization
LeetCode

Fetched directly via GraphQL query:

question(titleSlug) {
  difficulty
}
Codeforces (Auto-Mapped)

Rating → Difficulty:

Rating Range	Difficulty
≤ 1200	Easy
1300–1700	Medium
≥ 1800	Hard
AtCoder

Currently defaulted to "Medium"
(Expandable using AtCoder problem difficulty dataset)

📊 Google Sheet Data Model

Starting from row 14

Column	Field
A	Solve Date
B	Problem Title
C	Problem Link
D	Difficulty
E	Platform
F	Global Solve Count
G	Submission ID (CF/AC only)
🔍 Platform Integrations
🟢 LeetCode Integration
API Type:

GraphQL

Endpoint:
https://leetcode.com/graphql
Query Used:
recentAcSubmissionList(username, limit: 50)
Flow:

Fetch latest accepted submissions

Sort oldest → newest

Retrieve difficulty separately

Append if link not already present

🔵 Codeforces Integration
API Type:

REST

Endpoint:
https://codeforces.com/api/user.status?handle=HANDLE
Flow:

Fetch all submissions

Filter verdict === "OK"

Map rating → difficulty

Prevent duplicates via submission ID

🟣 AtCoder Integration
API Type:

Public JSON Mirror

Endpoint:
https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=HANDLE&from_second=0
Flow:

Fetch all submissions

Filter result === "AC"

Prevent duplicates using submission ID

Append sorted chronological order

🛡️ Error Handling Strategy

Each API call:

Wrapped in try-catch

Uses muteHttpExceptions

Validates response code

Prevents trigger failure

Time-driven triggers never crash silently.

⏰ Automation Strategy

Each function is attached to:

Time-Driven Trigger → Runs Daily

This ensures:

Continuous updates

Zero manual effort

Reliable incremental sync

🚀 How To Run This Project
🔧 STEP 1 — Create Google Sheet

Create a new Google Sheet

Name your sheet tab:

MUKESH S_ADS_TECH

Create headers in row 13:

Date | Title | Link | Difficulty | Platform | Count | SubmissionID
🔧 STEP 2 — Create Apps Script Project

Open Google Sheet

Go to:

Extensions → Apps Script

Delete default code

Paste your:

fetchLeetCodeDaily()

fetchCodeforcesDaily()

fetchAtCoderDaily()

🔧 STEP 3 — Set Platform Handles

Update:

const USERNAME = "your_leetcode_username";
const HANDLE = "your_codeforces_username";
const HANDLE = "your_atcoder_username";
🔧 STEP 4 — Authorize Permissions

Click Run (for each function once)

Grant permissions

Allow URL Fetch + Sheets access

🔧 STEP 5 — Add Time-Driven Trigger

Go to Apps Script → Triggers

Add Trigger

Choose function

Event source → Time-driven

Frequency → Daily

Repeat for all three platforms if needed.

🔧 STEP 6 — Initial Sync

Run each function manually once.

It will:

Populate historical data

Set baseline count

Initialize duplicate tracking

🧪 Testing

To test:

Solve a problem

Run function manually

Verify:

New row appended

Count increments

No duplicate created

📈 Scalability

This system supports:

Thousands of submissions

Safe re-runs

Multiple daily executions

Cross-platform data aggregation

🎯 Use Cases

Competitive programming progress tracking

LinkedIn content automation

Data analytics dashboard

API integration portfolio project

Serverless automation demonstration

🧠 Skills Demonstrated

REST API integration

GraphQL queries

Serverless automation

Idempotent design

Data normalization

Trigger-based scheduling

Structured logging

Error-resilient architecture

🚀 Future Enhancements

Monthly statistics dashboard

Difficulty distribution visualization

Streak detection

Rating tracking

LinkedIn auto-post integration

Public leaderboard comparison

👤 Author

Mukesh S
Competitive Programmer | Automation Enthusiast
