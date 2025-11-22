const { googleTranslate } = require('../../config/providers');

class TranslationService {
  async translate(text, sourceLang, targetLang) {
    try {
      const options = {
        to: targetLang
      };

      if (sourceLang && sourceLang !== 'auto') {
        options.from = sourceLang;
      }

      const [translation] = await googleTranslate.translate(text, options);

      // Detect language if not provided
      let detectedLanguage = sourceLang;
      if (!sourceLang || sourceLang === 'auto') {
        const [detection] = await googleTranslate.detect(text);
        detectedLanguage = detection.language;
      }

      return {
        translatedText: translation,
        detectedLanguage: detectedLanguage
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Translation failed');
    }
  }

  async detectLanguage(text) {
    try {
      const [detection] = await googleTranslate.detect(text);
      return detection.language;
    } catch (error) {
      console.error('Language detection error:', error);
      throw new Error('Language detection failed');
    }
  }

  async getSupportedLanguages() {
    try {
      const [languages] = await googleTranslate.getLanguages();
      return languages;
    } catch (error) {
      console.error('Get languages error:', error);
      throw new Error('Failed to get supported languages');
    }
  }
}

module.exports = new TranslationService();
