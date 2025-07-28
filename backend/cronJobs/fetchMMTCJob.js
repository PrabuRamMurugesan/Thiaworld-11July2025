// cronJobs/fetchMMTCJob.js

const cron = require("node-cron");
const axios = require("axios");

// Runs at 9AM, 12PM, 3PM, 5PM daily
cron.schedule("0 9,12,15,17 * * *", async () => {
  console.log("[CRON] Fetching MMTC-PAMP gold rate...");
  try {
    const res = await axios.get(
      `${API}/api/goldrate/fetch-mmtc-now`
    );
    console.log("[CRON] Response:", res.data.message);
  } catch (err) {
    console.error("[CRON] Error:", err.message);
  }
});
