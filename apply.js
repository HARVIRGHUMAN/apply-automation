const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// 🔒 Replace with your login credentials
const USERNAME = 'YOUR_USERNAME';
const PASSWORD = 'YOUR_PASSWORD';

// 🔍 Replace with your desired job title (e.g., 'software engineer')
const jobtitle = 'YOUR_JOB_TITLE';

async function applyToJob(jobLink, index = 0) {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  try {
    await page.goto(jobLink, { waitUntil: 'networkidle2' });
    const title = await page.$eval('#requisitionDescriptionInterface\\.reqTitleLinkAction\\.row1', el => el.textContent.trim());

    if (!title.toLowerCase().includes(jobtitle)) {
      console.log(`❌  Skipped: "${title}" is not a "${jobtitle}" job.`);
      await browser.close();
      return;
    }

    console.log(`✅  "${title}" — Starting application...`);

    // Go through application steps — you can customize or remove any section based on the employer portal
    // Each save-and-continue step assumes a similar structure

    await page.waitForSelector('#requisitionDescriptionInterface\\.UP_APPLY_ON_REQ\\.row1');
    await page.click('#requisitionDescriptionInterface\\.UP_APPLY_ON_REQ\\.row1');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    await page.waitForSelector('#dialogTemplate-dialogForm-StatementBeforeAuthentificationContent-ContinueButton');
    await page.click('#dialogTemplate-dialogForm-StatementBeforeAuthentificationContent-ContinueButton');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    await page.waitForSelector('#dialogTemplate-dialogForm-login-name1');
    await page.type('#dialogTemplate-dialogForm-login-name1', USERNAME);
    await page.type('#dialogTemplate-dialogForm-login-password', PASSWORD);
    await page.click('#dialogTemplate-dialogForm-login-defaultCmd');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Replace these selectors and dropdown values with the ones relevant to your application
    await page.select('#et-ef-content-ftf-gp-j_id_id16pc9-page_0-sourceTrackingBlock-recruitmentSourceType', '4');
    await page.select('#recruitmentSourceDP', 'REPLACE_WITH_SOURCE_CODE');

    // Continue through the form
    for (let i = 0; i < 7; i++) {
      await page.waitForSelector('#et-ef-content-ftf-saveContinueCmd', { visible: true });
      await page.click('#et-ef-content-ftf-saveContinueCmd');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }

    // Optional demographic selection (customize or skip based on your needs)
    // await page.select('#YOUR_SELECTOR_FOR_RACE', 'YOUR_OPTION');
    // await page.select('#YOUR_SELECTOR_FOR_GENDER', 'YOUR_OPTION');

    // Final Submit
    await page.waitForSelector('#et-ef-content-ftf-submitCmd');
    await page.click('#et-ef-content-ftf-submitCmd');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    console.log("✅ Application submitted successfully.");

  } catch (err) {
    console.log(`🚫 Error on job ${index + 1}: ${err.message}`);
  } finally {
    await browser.close();
  }
}

module.exports = applyToJob;
