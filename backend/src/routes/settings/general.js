// server/routes/settings.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Settings = require('../../models/Settings');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Set the upload directory
const uploadDir = path.join(__dirname, './uploads');

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage with overwrite logic
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    let filename = '';

    if (file.fieldname === 'logo') {
      filename = 'logo' + ext;
    } else if (file.fieldname === 'backgroundImage') {
      filename = 'background' + ext;
    }

    const fullPath = path.join(uploadDir, filename);

    // Delete old file if it exists
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    cb(null, filename);
  }
});

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// PUT route to upload/update settings
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

      if (logo?.[0]) {
        settings.logo = process.env.SERVER_URL + ":" + process.env.PORT + '/uploads/' + logo[0].filename;
      }

      if (backgroundImage?.[0]) {
        settings.backgroundImage = process.env.SERVER_URL + ":" + process.env.PORT  + '/uploads/' + backgroundImage[0].filename;
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

// GET route to retrieve settings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({ message: 'הגדרות לא נמצאו' });
    }

    return res.status(200).json({
      logo: settings.logo,
      backgroundImage: settings.backgroundImage,
      welcomeMessage: settings.welcomeMessage,
      termsOfUse: settings.termsOfUse,
      passwordExpiryDays: settings.passwordExpiryDays,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'שגיאה בהבאת ההגדרות' });
  }
});

module.exports = router;
