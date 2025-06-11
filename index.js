const checkGmailForJobs = require('./gmail');
const applyToJob = require('./apply');
const fs = require('fs');

const APPLIED_JOBS_PATH = './appliedJobs.json';

async function run() {
  const timestamp = new Date().toLocaleString();
  console.log(`\n📬 [${timestamp}] Checking Gmail for new jobs...`);

  const jobs = await checkGmailForJobs();

  const applied = fs.existsSync(APPLIED_JOBS_PATH)
    ? JSON.parse(fs.readFileSync(APPLIED_JOBS_PATH))
    : [];

  let newJobs = 0;

  for (const job of jobs) {
    if (!applied.includes(job.link)) {
      console.log(`✅ Found new job: ${job.title} at ${job.company}`);
      console.log(`🌐 Applying at: ${job.link}\n`);

      await applyToJob(job.link);

      applied.push(job.link);
      fs.writeFileSync(APPLIED_JOBS_PATH, JSON.stringify(applied, null, 2));
      newJobs++;
    } else {
      console.log(`🔁 Skipping duplicate: ${job.title}`);
    }
  }

  if (newJobs === 0) {
    console.log('🕵️‍♂️ No new jobs found this check.');
  }

  console.log('⏳ Waiting for next check...');
}

// Run immediately and repeat every 60 seconds
run();
setInterval(run, 60 * 1000);
