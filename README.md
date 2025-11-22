# 🌐 Translator App

Real-time multilingual voice and text translation web app built with React, Node.js, Google Cloud Translate, and Azure Speech Services. Instantly translate between 11+ languages using both text and live speech as input and output.

![License](https://img.shields.io/badge/License-Apache%202

- 🎤 **Voice & Text Input:** Translate spoken words or typed text instantly
- 🔊 **Voice Output:** Hear translations with expressive text-to-speech audio
- 🌍 **Multilingual:** Supports 11+ languages including English, Hindi, Bengali, Tamil, Telugu, Japanese, Chinese, Spanish, Portuguese, French, and Korean
- ⚛️ **Modern React Frontend:** Beautiful, responsive UI built with Vite and styled-components
- 🛡️ **Secure API:** Environment-based credentials and backend logic—no secrets in the client
- 🌐 **Cloud Powered:** Combines Google Cloud Translate API and Azure Cognitive Services for reliable translations and speech processing
- 🔄 **Seamless Switching:** Flexible source/target language selection with real-time feedback

***

## 📚 Tech Stack

### Frontend
- React
- Vite
- styled-components
- Framer Motion
- Web Speech API

### Backend
- Node.js
- Express
- Google Cloud Translate API
- Azure Speech Service

***

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Cloud account with Translate API enabled
- Azure account with Speech Service enabled

### 1. Clone the Repository

```bash
git clone https://github.com/avradeephalder/Translator-App.git
cd Translator-App
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
GOOGLE_APPLICATION_CREDENTIALS=./google-service-account-key.json
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=your_azure_region
PORT=5000
```

**Note:** Keep your credentials files and `.env` secure! They are excluded from git by `.gitignore`.

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd ../frontend/translator-frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The app will run on [http://localhost:5173](http://localhost:5173).

***

## 🖥️ Usage

1. **Select Languages:** Choose your input language (source) and output language (target) from the dropdowns
2. **Text Input:** Type your message in the text area and click send
3. **Voice Input:** Click the microphone icon to speak your message
4. **Listen to Translation:** The app automatically speaks the translated text with natural-sounding voices
5. **View History:** See all your translations in the chat interface with timestamps

***

## 🏗️ Project Structure

```
Translator-App/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── providers.js          # API provider configurations
│   │   ├── controllers/
│   │   │   └── translate.controller.js  # Translation logic
│   │   ├── middlewares/
│   │   │   └── errorHandler.js       # Error handling
│   │   ├── routes/
│   │   │   └── translate.routes.js   # API endpoints
│   │   ├── services/
│   │   │   ├── stt/
│   │   │   │   └── azureSpeech.js   # Speech-to-Text
│   │   │   ├── translation/
│   │   │   │   └── googleTranslate.js  # Google Translate
│   │   │   ├── tts/
│   │   │   │   └── azureTts.js      # Text-to-Speech
│   │   │   └── streams/
│   │   │       └── audioStream.js    # Audio streaming
│   │   ├── app.js
│   │   └── server.js
│   ├── .env                          # Environment variables (not tracked)
│   ├── .gitignore
│   └── package.json
│
└── frontend/translator-frontend/
    ├── src/
    │   ├── assets/
    │   ├── App.css
    │   ├── App.jsx
    │   ├── Home.jsx                   # Main translation interface
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── package.json
    └── vite.config.js
```

***

## 🔑 Environment Variables

The backend requires the following environment variables in `.env`:

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Google Cloud service account JSON | Yes |
| `AZURE_SPEECH_KEY` | Azure Speech Service API key | Yes |
| `AZURE_SPEECH_REGION` | Azure Speech Service region | Yes |
| `PORT` | Backend server port | No (default: 5000) |

***

## 🌟 Key Features Explained

### Voice Recognition
Uses Azure Speech Service for accurate speech-to-text conversion with support for multiple languages and dialects.

### Translation Engine
Google Cloud Translate API provides high-quality, context-aware translations with support for 100+ language pairs.

### Text-to-Speech
Azure Neural TTS delivers natural-sounding voice output with support for multiple voices per language.

### Real-time Processing
Efficient streaming architecture ensures minimal latency between input and translated output.

***

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend/translator-frontend
npm test
```

### Building for Production
```bash
# Frontend
cd frontend/translator-frontend
npm run build

# Backend
cd backend
npm run build
```

***

## 📝 API Documentation

### POST `/api/translate/text`
Translate text from one language to another.

**Request Body:**
```json
{
  "text": "Hello, world!",
  "sourceLang": "en",
  "targetLang": "hi"
}
```

**Response:**
```json
{
  "translated": "नमस्ते दुनिया!",
  "sourceLang": "en",
  "targetLang": "hi"
}
```

***

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

***

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

***

## 👨‍💻 Author

**Avradeep Halder**

- LinkedIn: [linkedin.com/in/avradeephalder](https://www.linkedin.com/in/avradeephalder/)
- GitHub: [@avradeephalder](https://github.com/avradeephalder)

***

## 🙏 Acknowledgments

- Google Cloud Platform for Translation API
- Microsoft Azure for Speech Services
- React and Vite communities for excellent tooling

***

## 📧 Contact

For questions or support, please [open an issue](https://github.com/avradeephalder/Translator-App/issues) or contact me via LinkedIn.

***

**⭐ If you find this project helpful, please give it a star!**

***

Copy this directly into your `README.md` file. It's comprehensive, professional, and clearly references the Apache 2.0 license! 🚀

[1](https://www.apache.org/licenses/LICENSE-2.0)
[2](https://github.com/justinmclean/ApacheWombat)
[3](https://fossa.com/blog/open-source-licenses-101-apache-license-2-0/)
[4](https://spdx.org/licenses/Apache-2.0.html)
[5](https://www.apache.org/legal/apply-license.html)
[6](https://snyk.io/articles/apache-license/)
[7](https://resilience4j.readme.io/docs/apache-20)
[8](https://www.scribd.com/document/655450404/Apache-License-2-0-Apache-2-0-Explained-in-Plain-English-TLDRLegal)
[9](https://www.mend.io/blog/top-10-apache-license-questions-answered/)
