// server/routes/settings.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Settings = require('../../models/Settings'); // Assuming you have a Settings model
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.put('/', authMiddleware, upload.fields([{ name: 'logo' }, { name: 'backgroundImage' }]), async (req, res) => {
  const { welcomeMessage, termsOfUse } = req.body;
  const { logo, backgroundImage } = req.files;

  try {
    const settings = await Settings.findOne(); // Assuming you have a single settings document

    if (logo) {
      // Save the logo file path
      settings.logo = logo[0].path;
    }

    if (backgroundImage) {
      // Save the background image file path
      settings.backgroundImage = backgroundImage[0].path;
    }

    settings.welcomeMessage = welcomeMessage || settings.welcomeMessage;
    settings.termsOfUse = termsOfUse || settings.termsOfUse;

    await settings.save();

    return res.status(200).json({ message: 'הגדרות כלליות נשמרו בהצלחה' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'שגיאה בשמירת ההגדרות' });
  }
});

module.exports = router;
