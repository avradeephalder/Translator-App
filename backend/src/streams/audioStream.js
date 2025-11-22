const sttService = require('../services/stt/azureSpeech');
const translationService = require('../services/translation/googleTranslate');
const ttsService = require('../services/tts/azureTts');

function handleAudioStream(ws) {
  let pushStream = null;
  let recognizer = null;
  let sessionConfig = {
    sourceLang: 'en-US',
    targetLang: 'es-ES'
  };

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());

      // Handle configuration
      if (data.type === 'config') {
        sessionConfig = {
          sourceLang: data.sourceLang || 'en-US',
          targetLang: data.targetLang || 'es-ES'
        };
        
        ws.send(JSON.stringify({
          type: 'config-received',
          config: sessionConfig
        }));
        return;
      }

      // Handle audio data
      if (data.type === 'audio') {
        const audioBuffer = Buffer.from(data.audio, 'base64');

        // Recognize speech
        const recognizedText = await sttService.recognizeFromFile(
          audioBuffer, 
          sessionConfig.sourceLang
        );

        // Send interim result
        ws.send(JSON.stringify({
          type: 'transcript',
          text: recognizedText,
          language: sessionConfig.sourceLang
        }));

        // Translate
        const translation = await translationService.translate(
          recognizedText,
          sessionConfig.sourceLang,
          sessionConfig.targetLang
        );

        // Send translation
        ws.send(JSON.stringify({
          type: 'translation',
          original: recognizedText,
          translated: translation.translatedText,
          targetLanguage: sessionConfig.targetLang
        }));

        // Synthesize speech
        const audioData = await ttsService.synthesize(
          translation.translatedText,
          sessionConfig.targetLang
        );

        // Send audio back
        ws.send(JSON.stringify({
          type: 'audio-response',
          audio: audioData.toString('base64'),
          text: translation.translatedText
        }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    if (recognizer) {
      recognizer.close();
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

module.exports = { handleAudioStream };
