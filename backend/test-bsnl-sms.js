// Test script for BSNL SMS API
// Run with: node test-bsnl-sms.js

const axios = require("axios");

const BSNL_SMS_CONFIG = {
  baseUrl: "https://bulksms.bsnl.in:5010",
  username: "bbspon",
  password: "1947@peaCOCK",
  senderId: "GLXINF",
};

const testPhone = "8190941584"; // Replace with your test phone number
const testMessage = "Test SMS from Thiaworld - Please ignore";

console.log("\n⚠️  IMPORTANT: Before testing, ensure:");
console.log("   1. Your BSNL Bulk SMS account is activated");
console.log("   2. Your sender ID 'GLXINF' is registered and approved");
console.log("   3. Your account has sufficient SMS credits/balance");
console.log("   4. Your username and password are correct\n");

async function testBSNLSMS() {
  console.log("🧪 Testing BSNL SMS API...\n");
  console.log("Configuration:");
  console.log(`  Base URL: ${BSNL_SMS_CONFIG.baseUrl}`);
  console.log(`  Username: ${BSNL_SMS_CONFIG.username}`);
  console.log(`  Sender ID: ${BSNL_SMS_CONFIG.senderId}`);
  console.log(`  Test Phone: ${testPhone}`);
  console.log(`  Test Message: ${testMessage}\n`);

  const endpoints = [
    {
      url: `${BSNL_SMS_CONFIG.baseUrl}/sendSMS`,
      method: "GET",
      params: {
        username: BSNL_SMS_CONFIG.username,
        password: BSNL_SMS_CONFIG.password,
        senderid: BSNL_SMS_CONFIG.senderId,
        message: testMessage,
        numbers: testPhone,
        smsservicetype: "singlemsg",
      },
      name: "GET /sendSMS"
    },
    {
      url: `${BSNL_SMS_CONFIG.baseUrl}/sendSMS`,
      method: "POST",
      data: {
        username: BSNL_SMS_CONFIG.username,
        password: BSNL_SMS_CONFIG.password,
        senderid: BSNL_SMS_CONFIG.senderId,
        message: testMessage,
        numbers: testPhone,
        smsservicetype: "singlemsg",
      },
      name: "POST /sendSMS"
    },
    {
      url: `${BSNL_SMS_CONFIG.baseUrl}/api/sendSMS`,
      method: "GET",
      params: {
        username: BSNL_SMS_CONFIG.username,
        password: BSNL_SMS_CONFIG.password,
        senderid: BSNL_SMS_CONFIG.senderId,
        message: testMessage,
        numbers: testPhone,
      },
      name: "GET /api/sendSMS"
    }
  ];

  for (const endpoint of endpoints) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Testing: ${endpoint.name}`);
    console.log(`URL: ${endpoint.url}`);
    console.log(`${"=".repeat(60)}`);
    
    try {
      let response;
      const startTime = Date.now();
      
      if (endpoint.method === "POST") {
        response = await axios.post(endpoint.url, endpoint.data, {
          headers: { "Content-Type": "application/json" },
          timeout: 15000,
        });
      } else {
        response = await axios.get(endpoint.url, {
          params: endpoint.params,
          timeout: 15000,
        });
      }
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ Request successful (${duration}ms)`);
      console.log(`Status Code: ${response.status}`);
      console.log(`Response Headers:`, JSON.stringify(response.headers, null, 2));
      console.log(`\nResponse Data:`);
      console.log(`  Type: ${typeof response.data}`);
      console.log(`  Value:`, response.data);
      
      if (typeof response.data === 'string') {
        console.log(`  Length: ${response.data.length}`);
        const lower = response.data.toLowerCase();
        if (lower.includes("success") || lower.includes("sent")) {
          console.log(`\n✅ SUCCESS INDICATOR FOUND IN RESPONSE!`);
        } else if (lower.includes("error") || lower.includes("fail")) {
          console.log(`\n❌ ERROR INDICATOR FOUND IN RESPONSE!`);
        }
      }
      
      // If this endpoint works, break
      if (response.status === 200) {
        console.log(`\n🎉 This endpoint format appears to work!`);
        break;
      }
    } catch (error) {
      console.log(`❌ Request failed`);
      if (error.response) {
        console.log(`Status Code: ${error.response.status}`);
        console.log(`Response Data:`, error.response.data);
      } else if (error.request) {
        console.log(`No response received - Network error`);
        console.log(`Error:`, error.message);
      } else {
        console.log(`Error:`, error.message);
      }
    }
  }
  
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Test completed. Check your phone for SMS.`);
  console.log(`If no SMS received, check the responses above for error messages.`);
}

testBSNLSMS().catch(console.error);
