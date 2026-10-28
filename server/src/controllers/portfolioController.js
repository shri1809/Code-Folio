const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

/**
 * Get current authenticated user's portfolio
 * GET /api/portfolio
 */
const getMyPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId: req.user._id,
        profile: {
          name: req.user.name || '',
          bio: '',
          socialLinks: { github: '', linkedin: '', twitter: '', website: '' },
          resumeUrl: '',
        },
        skills: { frontend: [], backend: [], devops: [] },
        projects: [],
      });
    }

    return res.status(200).json({
      success: true,
      portfolio,
      user: {
        name: req.user.name || '',
        username: req.user.username,
        email: req.user.email,
        isPro: req.user.isPro,
        templateId: req.user.templateId,
        customDomain: req.user.customDomain,
      },
    });
  } catch (err) {
    console.error(`[GetMyPortfolio Error]: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve portfolio data.',
    });
  }
};

/**
 * Update current authenticated user's portfolio
 * PUT /api/portfolio
 */
const updateMyPortfolio = async (req, res) => {
  try {
    const { profile, skills, projects, templateId, customDomain } = req.body;

    // Check custom domain permission (Pro only)
    if (customDomain !== undefined && customDomain !== null && customDomain !== '') {
      if (!req.user.isPro) {
        return res.status(403).json({
          success: false,
          error: 'Custom domain mapping requires an active CodeFolio Pro subscription.',
        });
      }

      // Check domain uniqueness across users
      const existingDomain = await User.findOne({
        customDomain: customDomain.toLowerCase().trim(),
        _id: { $ne: req.user._id },
      });

      if (existingDomain) {
        return res.status(400).json({
          success: false,
          error: 'This custom domain is already registered to another user.',
        });
      }
    }

    // Update User settings if templateId or customDomain provided
    const userUpdates = {};
    const userUnsets = {};

    if (templateId) userUpdates.templateId = templateId;
    if (profile?.name) userUpdates.name = profile.name.trim();

    if (customDomain !== undefined) {
      const cleanDomain = customDomain ? customDomain.toLowerCase().trim() : null;
      if (cleanDomain) {
        userUpdates.customDomain = cleanDomain;
      } else {
        userUnsets.customDomain = 1;
      }
    }

    const updateQuery = {};
    if (Object.keys(userUpdates).length > 0) updateQuery.$set = userUpdates;
    if (Object.keys(userUnsets).length > 0) updateQuery.$unset = userUnsets;

    if (Object.keys(updateQuery).length > 0) {
      await User.findByIdAndUpdate(req.user._id, updateQuery, { runValidators: true });
    }

    // Update Portfolio document
    let portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      portfolio = new Portfolio({ userId: req.user._id });
    }

    if (profile) {
      if (!portfolio.profile) portfolio.profile = {};
      portfolio.profile.name = profile.name !== undefined ? profile.name : (portfolio.profile.name || '');
      portfolio.profile.bio = profile.bio !== undefined ? profile.bio : (portfolio.profile.bio || '');
      if (!portfolio.profile.socialLinks) portfolio.profile.socialLinks = {};
      portfolio.profile.socialLinks.github = profile.socialLinks?.github ?? portfolio.profile.socialLinks.github ?? '';
      portfolio.profile.socialLinks.linkedin = profile.socialLinks?.linkedin ?? portfolio.profile.socialLinks.linkedin ?? '';
      portfolio.profile.socialLinks.twitter = profile.socialLinks?.twitter ?? portfolio.profile.socialLinks.twitter ?? '';
      portfolio.profile.socialLinks.website = profile.socialLinks?.website ?? portfolio.profile.socialLinks.website ?? '';
      if (profile.resumeUrl !== undefined) {
        let resumeVal = profile.resumeUrl ? String(profile.resumeUrl).trim() : '';
        if (resumeVal && !resumeVal.startsWith('/') && !resumeVal.startsWith('http://') && !resumeVal.startsWith('https://')) {
          resumeVal = `https://${resumeVal}`;
        }
        portfolio.profile.resumeUrl = resumeVal;
      }
    }

    if (skills) {
      if (!portfolio.skills) portfolio.skills = {};
      portfolio.skills.frontend = skills.frontend ?? portfolio.skills.frontend ?? [];
      portfolio.skills.backend = skills.backend ?? portfolio.skills.backend ?? [];
      portfolio.skills.devops = skills.devops ?? portfolio.skills.devops ?? [];
    }

    if (projects) {
      portfolio.projects = projects;
    }

    await portfolio.save();

    const updatedUser = await User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Portfolio successfully saved.',
      portfolio,
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        isPro: updatedUser.isPro,
        templateId: updatedUser.templateId,
        customDomain: updatedUser.customDomain || null,
      },
    });
  } catch (err) {
    console.error(`[UpdateMyPortfolio Error]: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to update portfolio.',
      details: err.message,
    });
  }
};

/**
 * Delete current user's portfolio or reset to default
 * DELETE /api/portfolio
 */
const deleteMyPortfolio = async (req, res) => {
  try {
    await Portfolio.findOneAndDelete({ userId: req.user._id });
    return res.status(200).json({
      success: true,
      message: 'Portfolio successfully deleted.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete portfolio.',
    });
  }
};

module.exports = {
  getMyPortfolio,
  updateMyPortfolio,
  deleteMyPortfolio,
};

