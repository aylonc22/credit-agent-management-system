// server/routes/settings.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Settings = require('../../models/Settings'); // Assuming you have a Settings model
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Configure multer for file uploads, save in the 'settings/uploads' folder
const upload = multer({
  dest: path.join(__dirname, './uploads'),  // Save uploads to 'settings/uploads'
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit to 5MB per file (you can adjust this as needed)
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files for logo and background image
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// PUT route to upload settings (logo, background image)
router.put(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
  ]),
  async (req, res) => {
    const { welcomeMessage, termsOfUse, passwordExpiryDays } = req.body;
    const logo = req.files?.logo;
    const backgroundImage = req.files?.backgroundImage;

    try {
      const settings = await Settings.findOne();
      if (!settings) {
        return res.status(404).json({ message: 'Settings not found' });
      }

      // Save logo if uploaded
      if (logo?.[0]) {
        settings.logo = '/settings/uploads/' + logo[0].filename; // Save relative path
        console.log( settings.logo)
      }

      // Save background image if uploaded
      if (backgroundImage?.[0]) {
        settings.backgroundImage = '/settings/uploads/' + backgroundImage[0].filename; // Save relative path
      }

      if (welcomeMessage !== undefined) {
        settings.welcomeMessage = welcomeMessage;
      }

      if (termsOfUse !== undefined) {
        settings.termsOfUse = termsOfUse;
      }

      if (passwordExpiryDays !== undefined && !isNaN(passwordExpiryDays)) {
        settings.passwordExpiryDays = Number(passwordExpiryDays);
      }

      await settings.save();

      return res.status(200).json({ message: 'הגדרות כלליות נשמרו בהצלחה' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'שגיאה בשמירת ההגדרות' });
    }
  }
);

// GET route to retrieve settings (including images)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Fetch the settings document (assuming there is a single settings document)
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({ message: 'הגדרות לא נמצאו' }); // Settings not found
    }

    // Return the settings in the response
    return res.status(200).json({
      logo: settings.logo,
      backgroundImage: settings.backgroundImage,
      welcomeMessage: settings.welcomeMessage,
      termsOfUse: settings.termsOfUse,
      passwordExpiryDays: settings.passwordExpiryDays,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'שגיאה בהבאת ההגדרות' }); // Error fetching settings
  }
});

module.exports = router;
