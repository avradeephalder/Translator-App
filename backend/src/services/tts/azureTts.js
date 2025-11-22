const { azureSpeechConfig, speechSdk } = require('../../config/providers');

class TextToSpeechService {
  async synthesize(text, targetLang = 'en-US') {
    return new Promise((resolve, reject) => {
      try {
        // Set voice based on language
        const voiceMap = {
          'en-US': 'en-US-JennyNeural',
          'es-ES': 'es-ES-ElviraNeural',
          'fr-FR': 'fr-FR-DeniseNeural',
          'de-DE': 'de-DE-KatjaNeural',
          'hi-IN': 'hi-IN-SwaraNeural',
          'ja-JP': 'ja-JP-NanamiNeural',
          'zh-CN': 'zh-CN-XiaoxiaoNeural'
        };

        azureSpeechConfig.speechSynthesisVoiceName = 
          voiceMap[targetLang] || 'en-US-JennyNeural';

        const synthesizer = new speechSdk.SpeechSynthesizer(azureSpeechConfig);

        synthesizer.speakTextAsync(
          text,
          result => {
            if (result.reason === speechSdk.ResultReason.SynthesizingAudioCompleted) {
              resolve(result.audioData);
            } else {
              reject(new Error(`TTS failed: ${result.errorDetails}`));
            }
            synthesizer.close();
          },
          error => {
            synthesizer.close();
            reject(error);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new TextToSpeechService();
