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
├── appliedJobs.json        # Tracks which jobs have been applied to (create an empty file with this name, including [] )
├── seenMessages.json       # Tracks which Gmail messages were already parsed (create an empty file with this nam,e including [] )
├── oauth2.keys.json        # Your Gmail API credentials (not committed)
├── token.json              # OAuth token from Gmail login (auto-generated)
└── README.md               # You are here 🙂

```

🔐 Setup Instructions
1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/job-automation-bot.git
cd job-automation-bot
npm install

2. Add Your Gmail API Credentials
Follow Google's OAuth steps to download your oauth2.keys.json file, and place it in the project root.
# Required file: oauth2.keys.json

3. First Time Authorization
When you first run the project, it will prompt you to visit a link and paste an auth code:
node index.js
This will save a token.json so you don’t have to re-authorize every time.

⚙️ Customization
Job Title Filter: Change JOB_TITLE in gmail.js and apply.js to whatever field you're interested in.

Email Search Filter: Update the gmail.users.messages.list query to match your alert provider.

Form Selectors: If you're using a different job portal (not Taleo), update the selectors in apply.js.

❗ Disclaimer
This project is for educational and personal productivity use only. Please check the terms of service of any platform you automate interactions with.
