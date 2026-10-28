const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const ContactMessage = require('../models/ContactMessage');
const { sendContactRelayEmail } = require('../services/mailService');

/**
 * Helper to strip internal/sensitive fields and format sanitized public response
 */
const sanitizePublicPortfolio = (user, portfolio) => {
  let resumeUrl = portfolio?.profile?.resumeUrl || '';
  if (resumeUrl && typeof resumeUrl === 'string') {
    const trimmed = resumeUrl.trim();
    if (trimmed && !trimmed.startsWith('/') && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      resumeUrl = `https://${trimmed}`;
    } else {
      resumeUrl = trimmed;
    }
  }

  return {
    user: {
      username: user.username,
      isPro: !!user.isPro,
      templateId: user.templateId || 'minimalist',
      customDomain: user.customDomain || null,
    },
    portfolio: {
      profile: {
        name: portfolio?.profile?.name || user.username,
        bio: portfolio?.profile?.bio || '',
        socialLinks: {
          github: portfolio?.profile?.socialLinks?.github || '',
          linkedin: portfolio?.profile?.socialLinks?.linkedin || '',
          twitter: portfolio?.profile?.socialLinks?.twitter || '',
          website: portfolio?.profile?.socialLinks?.website || '',
        },
        resumeUrl,
      },
      skills: {
        frontend: portfolio?.skills?.frontend || [],
        backend: portfolio?.skills?.backend || [],
        devops: portfolio?.skills?.devops || [],
      },
      projects: (portfolio?.projects || []).map((proj) => ({
        id: proj._id,
        title: proj.title,
        description: proj.description,
        techStack: proj.techStack || [],
        repoLink: proj.repoLink || '',
        liveLink: proj.liveLink || '',
        appStoreLink: proj.appStoreLink || '',
        playStoreLink: proj.playStoreLink || '',
        screenshot: proj.screenshot || '',
      })),
    },
  };
};

/**
 * Get sanitized public portfolio by username
 * GET /api/public/:username
 */
const getPublicPortfolio = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username parameter is required.',
      });
    }

    const normalizedUsername = username.toLowerCase().trim();

    // Find user (explicitly excluding password, email, otp, etc.)
    const user = await User.findOne({ username: normalizedUsername }).select(
      'username isPro templateId customDomain'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Portfolio for user '${normalizedUsername}' was not found.`,
      });
    }

    const portfolio = await Portfolio.findOne({ userId: user._id });

    const sanitizedData = sanitizePublicPortfolio(user, portfolio);

    return res.status(200).json({
      success: true,
      data: sanitizedData,
    });
  } catch (err) {
    console.error(`[GetPublicPortfolio Error]: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch public portfolio.',
    });
  }
};

/**
 * Resolve portfolio by custom domain (simulation endpoint)
 * GET /api/public/domain/:hostname
 */
const getPortfolioByDomain = async (req, res) => {
  try {
    const { hostname } = req.params;
    if (!hostname) {
      return res.status(400).json({
        success: false,
        error: 'Hostname parameter is required.',
      });
    }

    const normalizedHost = hostname.toLowerCase().trim();

    const user = await User.findOne({
      customDomain: normalizedHost,
      isPro: true,
    }).select('username isPro templateId customDomain');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `No active Pro portfolio found for custom domain '${normalizedHost}'.`,
      });
    }

    const portfolio = await Portfolio.findOne({ userId: user._id });
    const sanitizedData = sanitizePublicPortfolio(user, portfolio);

    return res.status(200).json({
      success: true,
      data: sanitizedData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to resolve custom domain portfolio.',
    });
  }
};

/**
 * Send contact email relay to developer without revealing their email
 * POST /api/public/:username/contact
 */
const sendContactRelay = async (req, res) => {
  try {
    const { username } = req.params;
    const { senderName, senderEmail, subject, message } = req.body;

    const normalizedUsername = username.toLowerCase().trim();

    // Look up developer to get their private email
    const user = await User.findOne({ username: normalizedUsername });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Developer '${normalizedUsername}' does not exist.`,
      });
    }

    // Save contact inquiry in database
    await ContactMessage.create({
      recipientUserId: user._id,
      senderName,
      senderEmail,
      subject: subject || `Portfolio Contact Message from ${senderName}`,
      message,
      senderIp: req.ip || '',
    });

    // Send email via Gmail SMTP with Fail-Safe error handling
    try {
      await sendContactRelayEmail(user.email, user.username, {
        senderName,
        senderEmail,
        subject,
        message,
      });
    } catch (mailError) {
      console.error(`[ContactRelay Mail Error]: ${mailError.message}`);
      return res.status(503).json({
        success: false,
        error: 'Email service temporarily unavailable. Please try again later.',
      });
    }

    // Never return the developer's email in response
    return res.status(200).json({
      success: true,
      message: `Your message was successfully relayed to @${user.username}.`,
    });
  } catch (err) {
    console.error(`[ContactRelay Error]: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while relaying your message.',
    });
  }
};

module.exports = {
  getPublicPortfolio,
  getPortfolioByDomain,
  sendContactRelay,
  sanitizePublicPortfolio,
};

