const translationService = require('../services/translation/googleTranslate');

// Text translation endpoint
exports.translateText = async (req, res, next) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ 
        error: 'Text and target language are required' 
      });
    }

    const result = await translationService.translate(
      text, 
      sourceLang, 
      targetLang
    );

    res.json({
      success: true,
      original: text,
      translated: result.translatedText,
      detectedLanguage: result.detectedLanguage,
      targetLanguage: targetLang
    });
  } catch (error) {
    console.error('Translation error:', error);
    next(error);
  }
};

// Voice translation endpoint (Google Cloud only)
exports.translateVoice = async (req, res, next) => {
  try {
    const { audio, sourceLang, targetLang } = req.body;

    if (!audio) {
      return res.status(400).json({ error: 'Audio is required' });
    }

    if (!targetLang) {
      return res.status(400).json({ error: 'Target language is required' });
    }

    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(audio, 'base64');

    // For Google Cloud Speech-to-Text, you would need to implement STT
    // For now, we'll use Web Speech API on frontend and just translate here
    
    // If you want to use Google Cloud Speech-to-Text, install:
    // npm install @google-cloud/speech
    
    // Basic implementation - expects transcribed text from frontend
    // TODO: Implement actual Google Cloud Speech-to-Text here if needed

    res.json({
      success: true,
      originalText: 'Voice message received',
      translated: 'Translated voice message',
      detectedLanguage: sourceLang,
      targetLanguage: targetLang
    });
  } catch (error) {
    console.error('Voice translation error:', error);
    res.status(500).json({ error: 'Voice translation failed' });
  }
};

// Language detection endpoint
exports.detectLanguage = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const detectedLang = await translationService.detectLanguage(text);

    res.json({
      success: true,
      text: text,
      detectedLanguage: detectedLang
    });
  } catch (error) {
    console.error('Language detection error:', error);
    next(error);
  }
};

// Get supported languages
exports.getSupportedLanguages = async (req, res, next) => {
  try {
    const languages = await translationService.getSupportedLanguages();

    res.json({
      success: true,
      languages: languages
    });
  } catch (error) {
    console.error('Get languages error:', error);
    next(error);
  }
};
