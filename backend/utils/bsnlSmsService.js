const axios = require("axios");

/**
 * BSNL BRPS Configuration
 * IMPORTANT:
 * - Entity_Id is NOT required for BSNL BRPS
 * - DLT is resolved internally using Content_Template_Id + Header
 */
const BSNL_SMS_CONFIG = {
  baseUrl: "https://bulksms.bsnl.in:5010",

  // Portal credentials
  username: "bbspon",
  password: "1947@peaCOCK",

  // From BSNL portal
  serviceId: "10894",
  senderId: "GLXINF",

  // Approved DLT Template ID (from your screenshot)
  contentTemplateId: "1407172612209917457",

  // JWT token cache
  jwtToken: null,

  // Mock mode for local/dev
  // Set BSNL_MOCK_MODE=false to enable real SMS sending
  mockMode: process.env.BSNL_MOCK_MODE === "true",
};

/**
 * Generate JWT Bearer Token
 */
const generateBSNLToken = async () => {
  if (BSNL_SMS_CONFIG.jwtToken) {
    return BSNL_SMS_CONFIG.jwtToken;
  }

  const url = `${BSNL_SMS_CONFIG.baseUrl}/api/Create_New_API_Token`;

  const payload = {
    Service_Id: BSNL_SMS_CONFIG.serviceId,
    Username: BSNL_SMS_CONFIG.username,
    Password: BSNL_SMS_CONFIG.password,
    Token_Id: "1",
    IP_Addresses: null,
  };

  const response = await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 15000,
  });

  const token = response.data?.token || response.data;

  if (!token || typeof token !== "string") {
    throw new Error("Invalid JWT token received from BSNL");
  }

  BSNL_SMS_CONFIG.jwtToken = token;
  return token;
};

/**
 * Normalize Indian mobile number
 */
const normalizeMobile = (mobileNumber) => {
  let num = mobileNumber.replace(/[\s\+\-\(\)]/g, "");
  if (num.startsWith("91") && num.length === 12) {
    num = num.slice(2);
  }
  if (!/^[6-9]\d{9}$/.test(num)) {
    throw new Error("Invalid Indian mobile number");
  }
  return num;
};

// When setting Target, prepend '91'


/**
 * Send OTP SMS using DLT Template
 * Uses:
 * - Push_Message
 * - Content_Template_Id
 * - Template_Key_Values
 */
const sendBSNLOTP = async (mobileNumber, otp) => {
  if (BSNL_SMS_CONFIG.mockMode) {
    console.log("📱 [MOCK] OTP SMS");
    console.log("Mobile:", mobileNumber);
    console.log("OTP:", otp);
    return { success: true, mock: true };
  }

  const token = await generateBSNLToken();

  const url = `${BSNL_SMS_CONFIG.baseUrl}/api/Push_Message`;
  const normalizedMobile = normalizeMobile(mobileNumber);
  // BSNL requires Target with country code (91) prepended
  const target = `91${normalizedMobile}`;

  const payload = {
    Service_Id: BSNL_SMS_CONFIG.serviceId,
    Header: BSNL_SMS_CONFIG.senderId,
    Target: target,
    Content_Template_Id: BSNL_SMS_CONFIG.contentTemplateId,
    // Template variable format: variable_name=value
    // Based on BSNL documentation, use the exact variable name from DLT template
    Template_Key_Values: `var=${otp}`,
    Flash: 0,
    Unicode: 0,
  };
  
  console.log("📱 BSNL SMS Request:");
  console.log("   URL:", url);
  console.log("   Mobile (normalized):", normalizedMobile);
  console.log("   Target (with 91):", target);
  console.log("   Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      timeout: 15000
    });

    console.log("📱 BSNL SMS Response:", JSON.stringify(response.data, null, 2));

    if (response.data?.Error) {
      console.error("❌ BSNL SMS Error:", response.data.Error);
      console.error("   Full Response:", JSON.stringify(response.data, null, 2));
      return {
        success: false,
        error: response.data.Error,
        message: response.data.Error,
        response: response.data,
        endpoint: "Push_Message"
      };
    }

    // Check for success indicators
    if (response.data?.Message_Id || response.data?.messageId) {
      console.log("✅ SMS sent successfully. Message ID:", response.data.Message_Id || response.data.messageId);
      return {
        success: true,
        messageId: response.data.Message_Id || response.data.messageId,
        response: response.data,
        endpoint: "Push_Message"
      };
    }

    // If no error but also no clear success indicator
    console.warn("⚠️ BSNL Response unclear:", JSON.stringify(response.data, null, 2));
    return {
      success: true, // Assume success if no error
      response: response.data,
      endpoint: "Push_Message"
    };
  } catch (error) {
    console.error("❌ BSNL SMS API Error:", error.message);
    if (error.response) {
      console.error("   Response Status:", error.response.status);
      console.error("   Response Data:", JSON.stringify(error.response.data, null, 2));
      return {
        success: false,
        error: error.response.data?.Error || error.message,
        message: error.response.data?.Error || error.message,
        response: error.response.data,
        endpoint: "Push_Message",
        httpStatus: error.response.status
      };
    }
    return {
      success: false,
      error: error.message,
      message: error.message,
      endpoint: "Push_Message"
    };
  }
};




/**
 * Public helper for OTP
 */
const sendOTPSMS = async (mobileNumber, otp) => {
  return await sendBSNLOTP(mobileNumber, otp);
};

module.exports = {
  sendOTPSMS,
  BSNL_SMS_CONFIG,
};
