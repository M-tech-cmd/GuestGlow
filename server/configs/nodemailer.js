import nodemailer from "nodemailer";

// Create transporter with correct SSL/TLS settings
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // false for 587, true for 465
  requireTLS: true, // Force TLS upgrade
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Additional TLS options
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
    ciphers: 'SSLv3'
  },
  // Connection timeout
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
});

// Test connection function with better error handling
export const testConnection = async () => {
  try {
    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.error('Error code:', error.code);
    return false;
  }
};

export default transporter;