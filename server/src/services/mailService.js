const nodemailer = require('nodemailer');

/**
 * Send email via Resend REST API (HTTPS Port 443 - unblocked on all cloud hosts)
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
        from: process.env.RESEND_FROM || process.env.EMAIL_FROM || 'CodeFolio <onboarding@resend.dev>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.warn('[Resend API Notice]:', data.message || data);
      return null;
    }
    return { provider: 'resend', id: data.id, delivered: true };
  } catch (err) {
    console.warn(`[Resend HTTP Warning]: ${err.message}`);
    return null;
  }
};

/**
 * Send email via Brevo (Sendinblue) v3 REST API (HTTPS Port 443 - works without custom domain)
 */
const sendViaBrevo = async ({ to, subject, html, replyTo, senderName }) => {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_EMAIL || 'codefolio9@gmail.com';
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: senderName || 'CodeFolio', email: senderEmail },
        to: Array.isArray(to) ? to.map(e => ({ email: e })) : [{ email: to }],
        subject,
        htmlContent: html,
        ...(replyTo ? { replyTo: { email: replyTo } } : {}),
      }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { provider: 'brevo', id: data.messageId, delivered: true };
    }
    const errText = await res.text();
    console.warn(`[Brevo API Notice] (${res.status}): ${errText}`);
    return null;
  } catch (err) {
    console.warn(`[Brevo HTTP Warning]: ${err.message}`);
    return null;
  }
};

/**
 * Send email via SendGrid v3 REST API (HTTPS Port 443)
 */
const sendViaSendGrid = async ({ to, subject, html }) => {
  const apiKey = process.env.SENDGRID_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const fromEmail = process.env.SENDGRID_FROM || process.env.SMTP_EMAIL || 'noreply@codefolio.dev';
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: Array.isArray(to) ? to.map(e => ({ email: e })) : [{ email: to }] }],
        from: { email: fromEmail, name: 'CodeFolio' },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    });

    if (res.ok) {
      return { provider: 'sendgrid', delivered: true };
    }
    const errText = await res.text();
    console.warn(`[SendGrid Notice] (${res.status}): ${errText}`);
    return null;
  } catch (err) {
    console.warn(`[SendGrid Warning]: ${err.message}`);
    return null;
  }
};

/**
 * Creates and returns the Gmail SMTP transporter with 4-second timeout
 */
const createTransporter = () => {
  const user = (process.env.SMTP_EMAIL || '').trim();
  const pass = (process.env.SMTP_APP_PASSWORD || '').replace(/\s+/g, '').trim();

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
    connectionTimeout: 4000,
    greetingTimeout: 4000,
    socketTimeout: 4000,
  });
};

/**
 * Send OTP Verification Email
 * @param {string} toEmail - Recipient email address
 * @param {string} otpCode - 6-digit plain text OTP code
 * @param {string} username - User's display or account username
 * @returns {Promise<object>} Dispatch result with provider and delivery status
 */
const sendOtpEmail = async (toEmail, otpCode, username = 'Developer') => {
  if (process.env.TEST_SIMULATE_SMTP_ERROR === 'true') {
    const error = new Error('SMTP connection timeout: unable to reach smtp.gmail.com');
    error.code = 'ETIMEDOUT';
    throw error;
  }

  // In development, log the OTP in big readable text in terminal
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
      provider: 'test-mock',
      delivered: true,
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

  const subject = `Your CodeFolio Verification Code: ${otpCode}`;
  const text = `Hello ${username},\n\nYour 6-digit CodeFolio verification code is: ${otpCode}\n\nThis code expires in 5 minutes.\n\nCodeFolio Team`;

  // 1. Try Resend HTTP API (Port 443)
  const resendResult = await sendViaResend({ to: toEmail, subject, html: htmlContent, text });
  if (resendResult?.delivered) return resendResult;

  // 2. Try Brevo HTTP API (Port 443)
  const brevoResult = await sendViaBrevo({ to: toEmail, subject, html: htmlContent, senderName: 'CodeFolio Security' });
  if (brevoResult?.delivered) return brevoResult;

  // 3. Try SendGrid HTTP API (Port 443)
  const sendgridResult = await sendViaSendGrid({ to: toEmail, subject, html: htmlContent });
  if (sendgridResult?.delivered) return sendgridResult;

  // 4. Try Gmail SMTP (Fast 4s attempt)
  const transporter = createTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"CodeFolio Security" <${process.env.SMTP_EMAIL || 'codefolio9@gmail.com'}>`,
        to: toEmail,
        subject,
        text,
        html: htmlContent,
      });
      return { provider: 'smtp', messageId: info.messageId, delivered: true };
    } catch (smtpErr) {
      console.warn(`[MailService SMTP Notice]: ${smtpErr.message}`);
    }
  }

  // 5. Cloud Sandbox Fallback (HabitForge pattern)
  console.log(`[SANDBOX OTP DISPATCH] -> ${toEmail} | CODE: ${otpCode}`);
  return { provider: 'sandbox-fallback', delivered: false, otpCode };
};

/**
 * Public Portfolio Contact Relay
 * Allows visitors to message a developer without revealing the developer's email address
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
      provider: 'test-mock',
      delivered: true,
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

  // 1. Resend
  const resendResult = await sendViaResend({
    to: recipientEmail,
    subject: `[CodeFolio Contact] ${safeSubject}`,
    html: htmlContent,
    text: `From: ${senderName} (${senderEmail})\nSubject: ${safeSubject}\n\nMessage:\n${message}`,
  });
  if (resendResult?.delivered) return resendResult;

  // 2. Brevo
  const brevoResult = await sendViaBrevo({
    to: recipientEmail,
    subject: `[CodeFolio Contact] ${safeSubject}`,
    html: htmlContent,
    replyTo: senderEmail,
    senderName: 'CodeFolio Contact Relay',
  });
  if (brevoResult?.delivered) return brevoResult;

  // 3. SMTP
  const transporter = createTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"CodeFolio Contact Relay" <${process.env.SMTP_EMAIL || 'relay@codefolio.dev'}>`,
        to: recipientEmail,
        replyTo: senderEmail,
        subject: `[CodeFolio Contact] ${safeSubject}`,
        text: `From: ${senderName} (${senderEmail})\nSubject: ${safeSubject}\n\nMessage:\n${message}`,
        html: htmlContent,
      });
      return { provider: 'smtp', messageId: info.messageId, delivered: true };
    } catch (smtpErr) {
      console.warn(`[Contact Relay SMTP Notice]: ${smtpErr.message}`);
    }
  }

  return { provider: 'sandbox-fallback', delivered: false };
};

module.exports = {
  createTransporter,
  sendOtpEmail,
  sendContactRelayEmail,
};
