const { azureSpeechConfig, speechSdk } = require('../../config/providers');

class SpeechToTextService {
  recognizeFromAudioStream(audioStream, sourceLang = 'en-US') {
    return new Promise((resolve, reject) => {
      try {
        // Set recognition language
        azureSpeechConfig.speechRecognitionLanguage = sourceLang;

        // Create push stream
        const pushStream = speechSdk.AudioInputStream.createPushStream();
        const audioConfig = speechSdk.AudioConfig.fromStreamInput(pushStream);
        
        // Create recognizer
        const recognizer = new speechSdk.SpeechRecognizer(
          azureSpeechConfig, 
          audioConfig
        );

        let recognizedText = '';

        // Handle recognized events
        recognizer.recognized = (s, e) => {
          if (e.result.reason === speechSdk.ResultReason.RecognizedSpeech) {
            recognizedText += e.result.text + ' ';
          }
        };

        // Handle errors
        recognizer.canceled = (s, e) => {
          recognizer.close();
          reject(new Error(`Speech recognition canceled: ${e.errorDetails}`));
        };

        // Handle session stopped
        recognizer.sessionStopped = (s, e) => {
          recognizer.close();
          resolve(recognizedText.trim());
        };

        // Start recognition
        recognizer.startContinuousRecognitionAsync();

        // Return push stream and recognizer for external control
        return { pushStream, recognizer };
      } catch (error) {
        reject(error);
      }
    });
  }

  async recognizeFromFile(audioBuffer, sourceLang = 'en-US') {
    return new Promise((resolve, reject) => {
      azureSpeechConfig.speechRecognitionLanguage = sourceLang;

      const pushStream = speechSdk.AudioInputStream.createPushStream();
      const audioConfig = speechSdk.AudioConfig.fromStreamInput(pushStream);
      
      const recognizer = new speechSdk.SpeechRecognizer(
        azureSpeechConfig, 
        audioConfig
      );

      pushStream.write(audioBuffer);
      pushStream.close();

      recognizer.recognizeOnceAsync(
        result => {
          if (result.reason === speechSdk.ResultReason.RecognizedSpeech) {
            resolve(result.text);
          } else {
            reject(new Error('Speech not recognized'));
          }
          recognizer.close();
        },
        error => {
          recognizer.close();
          reject(error);
        }
      );
    });
  }
}

module.exports = new SpeechToTextService();
