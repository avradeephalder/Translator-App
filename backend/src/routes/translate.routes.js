const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translate.controller');

// Text translation endpoint
router.post('/text', translateController.translateText);

// Language detection endpoint
router.post('/detect', translateController.detectLanguage);

// Get supported languages
router.get('/languages', translateController.getSupportedLanguages);

// For voice translation
router.post('/voice', translateController.translateVoice);

module.exports = router;
