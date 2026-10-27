const nodemailer = require('nodemailer');

/**
 * Send email via Resend REST API (HTTPS Port 443 - never blocked by Render cloud firewall)
 */
const sendViaResend = async ({ to, subject, html, text }) => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'CodeFolio <onboarding@resend.dev>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Resend HTTP API returned error');
    }
    return { messageId: data.id, accepted: [to], provider: 'resend' };
  } catch (err) {
    console.error(`[Resend HTTP Error]: ${err.message}`);
    throw err;
  }
};

/**
 * Creates and returns the Gmail SMTP transporter
 */
const createTransporter = () => {
  const user = (process.env.SMTP_EMAIL || '').trim();
  const pass = (process.env.SMTP_APP_PASSWORD || '').replace(/\s+/g, '').trim();

  if (!user || !pass) {
    throw new Error('SMTP credentials missing: SMTP_EMAIL and SMTP_APP_PASSWORD must be configured in environment variables.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
    // Prevent hanging sockets
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

/**
 * Send OTP Verification Email
 * @param {string} toEmail - Recipient email address
 * @param {string} otpCode - 6-digit plain text OTP code
 * @param {string} username - User's display or account username
 * @returns {Promise<object>} Nodemailer send result
 */
const sendOtpEmail = async (toEmail, otpCode, username = 'Developer') => {
  if (process.env.TEST_SIMULATE_SMTP_ERROR === 'true') {
    const error = new Error('SMTP connection timeout: unable to reach smtp.gmail.com');
    error.code = 'ETIMEDOUT';
    throw error;
  }

  // In development, log the OTP in big readable text in terminal so developer can test without delays
  if (process.env.NODE_ENV === 'development') {
    console.log('\n======================================================');
    console.log(`[DEVELOPMENT OTP DISPATCH] -> ${toEmail}`);
    console.log(`VERIFICATION CODE: ${otpCode}  (Valid for 5 minutes)`);
    console.log('======================================================\n');
  }

  // In test mode without simulated error, return mock receipt if credentials aren't provided
  if (process.env.NODE_ENV === 'test' && (!process.env.SMTP_EMAIL || !process.env.SMTP_APP_PASSWORD)) {
    return {
      messageId: `mock-test-${Date.now()}@codefolio.dev`,
      accepted: [toEmail],
      mock: true,
    };
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #111827; margin-bottom: 8px;">CodeFolio Security Verification</h2>
      <p style="color: #4b5563; font-size: 15px; margin-bottom: 24px;">Hello <strong>${username}</strong>,</p>
      <p style="color: #4b5563; font-size: 15px; margin-bottom: 16px;">Your one-time 6-digit verification code is:</p>
      <div style="background-color: #f3f4f6; padding: 18px; border-radius: 6px; text-align: center; margin-bottom: 24px;">
        <span style="font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #4f46e5;">${otpCode}</span>
      </div>
      <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">This code will expire in <strong>5 minutes</strong>. If you did not initiate this request, please secure your account immediately.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #9ca3af; font-size: 11px; text-align: center;">CodeFolio &copy; 2026. Built with high security by design.</p>
    </div>
  `;

  // Prefer Resend REST API if configured (uses HTTPS port 443; never blocked on cloud hosting)
  if (process.env.RESEND_API_KEY) {
    return await sendViaResend({
      to: toEmail,
      subject: `Your CodeFolio Verification Code: ${otpCode}`,
      html: htmlContent,
      text: `Hello ${username},\n\nYour 6-digit CodeFolio verification code is: ${otpCode}\n\nThis code expires in 5 minutes.\n\nCodeFolio Team`,
    });
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"CodeFolio Security" <${process.env.SMTP_EMAIL || 'security@codefolio.dev'}>`,
    to: toEmail,
    subject: `Your CodeFolio Verification Code: ${otpCode}`,
    text: `Hello ${username},\n\nYour 6-digit CodeFolio verification code is: ${otpCode}\n\nThis code expires in 5 minutes.\n\nCodeFolio Team`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error(`[MailService] Failed to send OTP email to ${toEmail}: ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
      console.warn('[MailService] (Development Mode) Proceeding with the terminal verification code.');
      return { messageId: 'dev-fallback-mock', accepted: [toEmail], mock: true };
    }
    throw err;
  }
};

/**
 * Public Portfolio Contact Relay
 * Allows visitors to message a developer without revealing the developer's email address
 * @param {string} recipientEmail - The developer's hidden email address
 * @param {string} developerUsername - Developer username
 * @param {object} contactData - { senderName, senderEmail, subject, message }
 * @returns {Promise<object>}
 */
const sendContactRelayEmail = async (
  recipientEmail,
  developerUsername,
  { senderName, senderEmail, subject, message }
) => {
  if (process.env.TEST_SIMULATE_SMTP_ERROR === 'true') {
    const error = new Error('SMTP connection timeout: unable to reach smtp.gmail.com');
    error.code = 'ETIMEDOUT';
    throw error;
  }

  if (process.env.NODE_ENV === 'test' && (!process.env.SMTP_EMAIL || !process.env.SMTP_APP_PASSWORD)) {
    return {
      messageId: `mock-relay-${Date.now()}@codefolio.dev`,
      accepted: [recipientEmail],
      mock: true,
    };
  }

  const safeSubject = subject || `New contact inquiry for @${developerUsername}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
      <h3 style="color: #111827; margin-bottom: 4px;">CodeFolio Contact Relay</h3>
      <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">Someone sent you a message through your public portfolio at <strong>codefolio.dev/u/${developerUsername}</strong></p>
      
      <div style="background-color: #f9fafb; border-left: 4px solid #4f46e5; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>From:</strong> ${senderName} (&lt;${senderEmail}&gt;)</p>
        <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Subject:</strong> ${safeSubject}</p>
        <p style="margin: 12px 0 0 0; font-size: 14px; color: #1f2937; white-space: pre-wrap;">${message}</p>
      </div>

      <p style="font-size: 13px; color: #4b5563;">You can reply directly to this message to correspond with <strong>${senderEmail}</strong>.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #9ca3af; font-size: 11px;">Notice: Your email address was NOT exposed to the sender.</p>
    </div>
  `;

  if (process.env.RESEND_API_KEY) {
    return await sendViaResend({
      to: recipientEmail,
      subject: `[CodeFolio Contact] ${safeSubject}`,
      html: htmlContent,
      text: `From: ${senderName} (${senderEmail})\nSubject: ${safeSubject}\n\nMessage:\n${message}`,
    });
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"CodeFolio Contact Relay" <${process.env.SMTP_EMAIL || 'relay@codefolio.dev'}>`,
    to: recipientEmail,
    replyTo: senderEmail,
    subject: `[CodeFolio Contact] ${safeSubject}`,
    text: `From: ${senderName} (${senderEmail})\nSubject: ${safeSubject}\n\nMessage:\n${message}`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error(`[MailService] Failed to relay contact email to developer: ${err.message}`);
    throw err;
  }
};

module.exports = {
  createTransporter,
  sendOtpEmail,
  sendContactRelayEmail,
};

