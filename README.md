# 🤖 Automated Job Application Bot (Gmail + Puppeteer)

This is a Node.js automation project that helps you streamline job applications using Gmail job alerts and Puppeteer. It scrapes your Gmail inbox for job links and automatically applies on your behalf by navigating employer portals like Taleo.

---

## 🔧 Features

- 🔎 Automatically checks Gmail for new job postings based on filters.
- 🤖 Uses Puppeteer + stealth plugin to automate job applications.
- 📝 Automatically fills in application steps like login, personal info, work history, and final submission.
- 🧠 Prevents duplicate applications using local job tracking.
- 📦 Easily configurable via environment variables or placeholders.

---

## 📁 Project Structure

```bash
.
├── apply.js                # Puppeteer bot that fills out application forms
├── gmail.js                # Gmail API script that extracts job alerts
├── index.js                # Main controller (runs both modules)
├── appliedJobs.json        # Tracks which jobs have been applied to (create an empty file with this name including [] )
├── seenMessages.json       # Tracks which Gmail messages were already parsed (create an empty file with this name including [] )
├── oauth2.keys.json        # Your Gmail API credentials (not committed)
├── token.json              # OAuth token from Gmail login (auto-generated)
└── README.md               # You are here 🙂
