'use strict';
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');
const cheerio = require('cheerio');

const CREDENTIALS_PATH = path.join(__dirname, 'oauth2.keys.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const SEEN_PATH = path.join(__dirname, 'seenMessages.json');

function loadCredentials() {
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
}

function loadSeenMessages() {
  if (!fs.existsSync(SEEN_PATH)) return [];
  const entries = JSON.parse(fs.readFileSync(SEEN_PATH));
  const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const filtered = entries.filter(entry => entry.timestamp > oneMonthAgo);
  fs.writeFileSync(SEEN_PATH, JSON.stringify(filtered, null, 2));
  return filtered;
}

function saveSeenMessage(messageId, timestamp) {
  const seen = loadSeenMessages();
  seen.push({ id: messageId, timestamp });
  fs.writeFileSync(SEEN_PATH, JSON.stringify(seen, null, 2));
}

async function authorize() {
  const { client_secret, client_id } = loadCredentials().installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'urn:ietf:wg:oauth:2.0:oob');

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });

  console.log('🔑 Authorize this app by visiting:\n', authUrl);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise(resolve => rl.question('Enter the code from that page: ', resolve));
  rl.close();

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log('✅ Token saved.');
  return oAuth2Client;
}

async function checkGmailForJobs() {
  const auth = await authorize();
  const gmail = google.gmail({ version: 'v1', auth });
  const seenMessages = loadSeenMessages();

  const res = await gmail.users.messages.list({
    userId: 'me',
    // 📨 Update these filters for your email structure
    q: 'from:YOUR_ALERT_EMAIL subject:"Job Posting Notification"',
    maxResults: 5,
  });

  const jobPosts = [];

  for (const msg of res.data.messages || []) {
    if (seenMessages.find(entry => entry.id === msg.id)) continue;

    const full = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
      format: 'full',
    });

    const internalDate = parseInt(full.data.internalDate);
    const parts = full.data.payload.parts || [];
    const htmlPart = parts.find(part => part.mimeType === 'text/html');
    if (!htmlPart) continue;

    const body = Buffer.from(htmlPart.body.data, 'base64').toString();
    const $ = cheerio.load(body);
    const bodyText = $('body').text().toLowerCase();

    if (!bodyText.includes(jobtitle)) { // Optional filter
      console.log(`🔎 Skipped non-matching job from msg ID: ${msg.id}`);
      saveSeenMessage(msg.id, internalDate);
      continue;
    }

    let jobLink = null;
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if ($(el).text().toLowerCase().includes('view the job posting') && href) {
        jobLink = href;
      }
    });

    if (jobLink) {
      jobPosts.push({
        title: 'Job Title Here', // optional parsing
        company: 'Company Name',
        link: jobLink,
      });
    }

    saveSeenMessage(msg.id, internalDate);
  }

  return jobPosts;
}

module.exports = checkGmailForJobs;
