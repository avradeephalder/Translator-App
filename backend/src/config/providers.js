const { Translate } = require('@google-cloud/translate').v2;

// Google Translate Client
const googleTranslate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

module.exports = {
  googleTranslate
};