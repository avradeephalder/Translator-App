import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Send, Mic, Square, ArrowDown, Loader, Play, Pause } from 'react-feather';

// ==================== STYLED COMPONENTS ====================
const Container = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: linear-gradient(90deg, #1f2d6d 0%, #2d3e8f 50%, #1a2554 100%);
  display: flex;
  align-items: center;
  padding: 0 30px;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  h1 {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(90deg, #00d4ff, #0099ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    letter-spacing: 0.5px;
  }
`;

const LeftPanel = styled(motion.div)`
  width: 35%;
  background: linear-gradient(135deg, #0f1729 0%, #1a2554 50%, #0d0f1f 100%);
  border-right: 1px solid rgba(0, 200, 255, 0.1);
  display: flex;
  flex-direction: column;
  padding: 100px 30px 30px 30px;
  overflow-y: auto;
  gap: 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 200, 255, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(0, 200, 255, 0.5);
    }
  }
`;

const LanguageSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  justify-content: center;
`;

const SectionLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-left: 5px;
`;

const LanguageDropdown = styled.select`
  padding: 14px 16px;
  padding-right: 45px;
  background: linear-gradient(135deg, rgba(0, 200, 255, 0.1), rgba(0, 150, 255, 0.08));
  border: 2px solid rgba(0, 200, 255, 0.2);
  border-radius: 10px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2300c8ff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 18px;

  &:hover {
    border-color: rgba(0, 200, 255, 0.4);
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2300d4ff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 18px;
  }

  &:focus {
    border-color: #00c8ff;
    box-shadow: 0 0 12px rgba(0, 200, 255, 0.2);
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2300c8ff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 18px;
  }

  option {
    background: #0a0e27;
    color: #ffffff;
  }
`;

const ArrowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  width: 100%;
  height: 100px;
`;

const ArrowIcon = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(0, 200, 255, 0.8);
  font-size: 20px;
  
  svg {
    width: 130px;
    height: 130px;
    stroke-width: 2;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 70px;
  background: linear-gradient(135deg, #0a0e27 0%, #0f1729 50%, #0d0f1f 100%);
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 25px 30px;
  overflow-y: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 200, 255, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(0, 200, 255, 0.5);
    }
  }
`;

const MessageBubble = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 65%;
  animation: fadeInUp 0.4s ease;

  ${(props) =>
    props.$isUser &&
    `
    align-self: flex-end;
    align-items: flex-end;
  `}

  ${(props) =>
    !props.$isUser &&
    `
    align-self: flex-start;
    align-items: flex-start;
  `}

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    max-width: 85%;
  }
`;

const BubbleContent = styled.div`
  padding: ${(props) => (props.$isVoice ? '8px 10px' : '14px 16px')};
  border-radius: 16px;
  word-wrap: break-word;
  font-size: 15px;
  line-height: 1.5;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;

  ${(props) =>
    props.$isUser
      ? `
    background: linear-gradient(135deg, #00c8ff, #0099ff);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 200, 255, 0.2);
  `
      : `
    background: rgba(255, 255, 255, 0.08);
    color: #e0e0e0;
    border: 1px solid rgba(0, 200, 255, 0.15);
    border-bottom-left-radius: 4px;
  `}

  &:hover {
    ${(props) =>
      props.$isUser
        ? `box-shadow: 0 6px 16px rgba(0, 200, 255, 0.3);`
        : `background: rgba(255, 255, 255, 0.1);`}
  }
`;

const MessageType = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: rgba(0, 200, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-left: ${(props) => (props.$isUser ? 'auto' : '0')};
  margin-right: ${(props) => (props.$isUser ? '0' : 'auto')};
`;

const Timestamp = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  margin-left: ${(props) => (props.$isUser ? 'auto' : '0')};
  margin-right: ${(props) => (props.$isUser ? '0' : 'auto')};
`;

// ==================== WAVEFORM AUDIO PLAYER ====================

const VoiceMessageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  min-width: 280px;
  max-width: 350px;
`;

const PlayButton = styled.button`
  width: 32px;
  height: 32px;
  min-width: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
    stroke-width: 2.5;
    margin-left: ${(props) => (props.$isPlaying ? '0' : '2px')};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const WaveformContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const WaveformBars = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2px;
  height: 32px;
  width: 100%;
`;

const Bar = styled.div`
  flex: 1;
  min-width: 2px;
  max-width: 3px;
  height: ${(props) => props.$height}%;
  background: ${(props) =>
    props.$active
      ? 'rgba(255, 255, 255, 0.9)'
      : 'rgba(255, 255, 255, 0.4)'};
  border-radius: 2px;
  transition: all 0.1s ease;
`;

const TimeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TimeText = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  min-width: 35px;
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
  cursor: pointer;
  margin: 0 8px;
  position: relative;
  overflow: hidden;

  &:hover {
    height: 3px;
  }
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${(props) => props.$progress}%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1px;
  transition: width 0.1s linear;
`;

const InputContainer = styled.div`
  padding: 16px 30px 24px 30px;
  background: transparent;
  display: flex;
  gap: 12px;
  align-items: center;
  height: 70px;
`;

const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  gap: 12px;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(0, 200, 255, 0.2);
  border-radius: 24px;
  padding: 6px 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  height: 48px;

  &:hover {
    border-color: rgba(0, 200, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
  }

  &:focus-within {
    border-color: #00c8ff;
    box-shadow: 0 0 12px rgba(0, 200, 255, 0.2);
    background: rgba(255, 255, 255, 0.12);
  }
`;

const TextInput = styled.textarea`
  flex: 1;
  padding: 0;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  max-height: 100px;
  outline: none;
  height: 24px;
  line-height: 24px;
  vertical-align: middle;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MicButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: linear-gradient(135deg, #00c8ff, #0099ff);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.5;
  }

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 200, 255, 0.3);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${(props) =>
    props.$recording &&
    `
    background: linear-gradient(135deg, #ff4444, #cc0000);
    animation: pulse 1s infinite;

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7);
      }
      50% {
        box-shadow: 0 0 0 10px rgba(255, 68, 68, 0);
      }
    }
  `}
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  background: linear-gradient(135deg, #00c8ff, #0099ff);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 2.5;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 200, 255, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  color: rgba(255, 255, 255, 0.3);
  gap: 15px;
  text-align: center;

  p {
    font-size: 16px;
    margin: 0;
  }

  .emoji {
    font-size: 48px;
  }
`;

// ==================== AUDIO WAVEFORM COMPONENT ====================

const AudioWaveform = ({ src, isUser }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const [waveformBars] = useState(() => 
    Array.from({ length: 40 }, () => Math.random() * 80 + 20)
  );

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && duration) {
      audioRef.current.currentTime = percent * duration;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <VoiceMessageContainer>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <PlayButton onClick={handlePlayPause} $isPlaying={isPlaying}>
        {isPlaying ? <Pause /> : <Play />}
      </PlayButton>

      <WaveformContainer>
        <WaveformBars>
          {waveformBars.map((height, idx) => (
            <Bar
              key={idx}
              $height={height}
              $active={idx < (progress / 100) * waveformBars.length}
            />
          ))}
        </WaveformBars>
        <TimeContainer>
          <TimeText>{formatTime(currentTime)}</TimeText>
          <ProgressBarContainer onClick={handleProgressClick}>
            <ProgressBarFill $progress={progress} />
          </ProgressBarContainer>
          <TimeText>{formatTime(duration)}</TimeText>
        </TimeContainer>
      </WaveformContainer>
    </VoiceMessageContainer>
  );
};

// ==================== MAIN COMPONENT ====================

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('hi');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null);
  const textInputRef = useRef(null);

  const languages = {
    en: 'English',
    bn: 'Bengali',
    hi: 'Hindi',
    ta: 'Tamil',
    te: 'Telugu',
    ja: 'Japanese',
    zh: 'Chinese',
    es: 'Spanish',
    pt: 'Portuguese',
    fr: 'French',
    ko: 'Korean',
  };

  const languageVoices = {
    en: 'en-US',
    bn: 'bn-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    ja: 'ja-JP',
    zh: 'zh-CN',
    es: 'es-ES',
    pt: 'pt-PT',
    fr: 'fr-FR',
    ko: 'ko-KR',
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendText = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'text',
      content: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/translate/text', {
        text: inputText,
        sourceLang: fromLang,
        targetLang: toLang,
      });

      const translatedText = response.data.translated || response.data.translatedText || '';

      const translatedMessage = {
        id: Date.now() + 1,
        type: 'text',
        content: translatedText,
        sender: 'system',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, translatedMessage]);

      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = languageVoices[toLang];
      utterance.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      setError(err.response?.data?.error || 'Translation failed');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    
    const speechRecognitionLangs = {
      en: 'en-US',
      bn: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      ja: 'en-US',
      zh: 'zh-CN',
      es: 'es-ES',
      pt: 'pt-PT',
      fr: 'fr-FR',
      ko: 'ko-KR',
    };

    recognition.lang = speechRecognitionLangs[fromLang] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    let recognizedText = '';
    let hasResult = false;

    let mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Show user's voice message - DON'T PLAY IT AUTOMATICALLY
      const userMessage = {
        id: Date.now(),
        type: 'voice',
        content: audioUrl,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      if (recognizedText.trim()) {
        try {
          const response = await axios.post('http://localhost:5000/api/translate/text', {
            text: recognizedText.trim(),
            sourceLang: fromLang,
            targetLang: toLang,
          });

          const translatedText = response.data.translated || response.data.translatedText || '';

          const translatedMessage = {
            id: Date.now() + 1,
            type: 'text',
            content: translatedText,
            sender: 'system',
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, translatedMessage]);

          // ONLY speak the translated text, NOT the original voice
          const speechSynthesisLangs = {
            en: 'en-US',
            bn: 'bn-IN',
            hi: 'hi-IN',
            ta: 'ta-IN',
            te: 'te-IN',
            ja: 'ja-JP',
            zh: 'zh-CN',
            es: 'es-ES',
            pt: 'pt-PT',
            fr: 'fr-FR',
            ko: 'ko-KR',
          };

          const utterance = new SpeechSynthesisUtterance(translatedText);
          utterance.lang = speechSynthesisLangs[toLang] || 'en-US';
          utterance.rate = 0.9;

          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          setError(err.response?.data?.error || 'Translation failed');
        }
      } else {
        setError('No speech detected');
      }

      setIsLoading(false);
      setIsRecording(false);
      stream.getTracks().forEach(track => track.stop());
    };

    recognition.onresult = (event) => {
      hasResult = true;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          recognizedText += event.results[i][0].transcript + ' ';
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      if (event.error === 'no-speech') {
        setError('No speech detected. Speak clearly.');
      } else {
        setError(`Error: ${event.error}`);
      }
      setIsRecording(false);
      setIsLoading(false);
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());
    };

    recognition.onend = () => {
      mediaRecorder.stop();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    recognition.start();
    setIsRecording(true);
    setIsLoading(true);
    setError('');

  } catch (err) {
    setError('Microphone access denied');
    console.error('Microphone error:', err);
  }
};

  const stopRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }
};


  const handleSendVoiceMessage = async (audioBlob) => {
  const audioUrl = URL.createObjectURL(audioBlob);
  
  // Show user's voice message on RIGHT side
  const userMessage = {
    id: Date.now(),
    type: 'voice',
    content: audioUrl,
    sender: 'user',
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setIsLoading(true);
  setError('');

  try {
    // Use Web Speech API to convert voice to text
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in this browser');
      setIsLoading(false);
      return;
    }

    const recognition = new SpeechRecognition();
    
    // Language codes for Web Speech Recognition
    const speechRecognitionLangs = {
      en: 'en-US',
      bn: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      ja: 'en-US',
      zh: 'zh-CN',
      es: 'es-ES',
      pt: 'pt-PT',
      fr: 'fr-FR',
      ko: 'ko-KR',
    };

    recognition.lang = speechRecognitionLangs[fromLang] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    let recognizedText = '';
    let hasResult = false;

    recognition.onresult = async (event) => {
      hasResult = true;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          recognizedText += event.results[i][0].transcript + ' ';
        }
      }
    };

    recognition.onend = async () => {
      // When recognition ends, immediately translate
      if (recognizedText.trim()) {
        try {
          const response = await axios.post('http://localhost:5000/api/translate/text', {
            text: recognizedText.trim(),
            sourceLang: fromLang,
            targetLang: toLang,
          });

          const translatedText = response.data.translated || response.data.translatedText || '';

          // Show translated response on LEFT side
          const translatedMessage = {
            id: Date.now() + 1,
            type: 'text',
            content: translatedText,
            sender: 'system',
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, translatedMessage]);

          // Speak the translated text
          const speechSynthesisLangs = {
            en: 'en-US',
            bn: 'bn-IN',
            hi: 'hi-IN',
            ta: 'ta-IN',
            te: 'te-IN',
            ja: 'ja-JP',
            zh: 'zh-CN',
            es: 'es-ES',
            pt: 'pt-PT',
            fr: 'fr-FR',
            ko: 'ko-KR',
          };

          const utterance = new SpeechSynthesisUtterance(translatedText);
          utterance.lang = speechSynthesisLangs[toLang] || 'en-US';
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;

          utterance.onerror = (event) => {
            console.warn(`Voice not available for ${toLang}`);
          };

          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);

        } catch (err) {
          setError(err.response?.data?.error || 'Translation failed');
          console.error('Translation error:', err);
        }
      } else if (!hasResult) {
        setError('No speech detected. Please try again.');
      }
      
      setIsLoading(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      if (event.error === 'no-speech') {
        setError('No speech detected. Please speak clearly.');
      } else if (event.error === 'audio-capture') {
        setError('No microphone found.');
      } else if (event.error === 'network') {
        setError('Network error.');
      } else {
        setError(`Error: ${event.error}`);
      }
      setIsLoading(false);
    };

    // START RECOGNITION IMMEDIATELY - DON'T WAIT FOR AUDIO TO PLAY
    // This is much faster!
    recognition.start();

    // Set 10 second timeout
    const timeout = setTimeout(() => {
      if (isLoading) {
        recognition.abort();
        setError('Voice recognition timed out.');
        setIsLoading(false);
      }
    }, 10000);

    // Clean up timeout when done
    const checkTimeout = setInterval(() => {
      if (!isLoading) {
        clearTimeout(timeout);
        clearInterval(checkTimeout);
      }
    }, 500);

  } catch (err) {
    setError('Failed to process voice message');
    console.error('Error:', err);
    setIsLoading(false);
  }
};


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  return (
    <Container>
      <Header>
        <h1>AI Translator</h1>
      </Header>

      <LeftPanel initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <LanguageSection>
          <SectionLabel>Translate From</SectionLabel>
          <LanguageDropdown value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </LanguageDropdown>
        </LanguageSection>

        <ArrowContainer>
          <ArrowIcon animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowDown />
          </ArrowIcon>
        </ArrowContainer>

        <LanguageSection>
          <SectionLabel>Translate To</SectionLabel>
          <LanguageDropdown value={toLang} onChange={(e) => setToLang(e.target.value)}>
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </LanguageDropdown>
        </LanguageSection>
      </LeftPanel>

      <RightPanel>
        <ChatContainer>
          <AnimatePresence>
            {messages.length === 0 && (
              <EmptyState>
                <div className="emoji">🌐</div>
                <p>Select languages and start translating</p>
                <p style={{ fontSize: '12px', opacity: 0.5 }}>Send text or use voice input</p>
              </EmptyState>
            )}
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                $isUser={msg.sender === 'user'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <MessageType $isUser={msg.sender === 'user'}>
                  {msg.type === 'voice' ? '🎤 Voice' : '💬 Text'}
                </MessageType>
                <BubbleContent $isUser={msg.sender === 'user'} $isVoice={msg.type === 'voice'}>
                  {msg.type === 'text' ? (
                    msg.content
                  ) : (
                    <AudioWaveform src={msg.content} isUser={msg.sender === 'user'} />
                  )}
                </BubbleContent>
                <Timestamp $isUser={msg.sender === 'user'}>{formatTime(msg.timestamp)}</Timestamp>
              </MessageBubble>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </ChatContainer>

        <InputContainer>
          <InputWrapper>
            <TextInput
              ref={textInputRef}
              placeholder="Type a message"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows="1"
              disabled={isRecording || isLoading}
            />
            <MicButton
              $recording={isRecording}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              title={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <Square size={16} /> : <Mic size={16} />}
            </MicButton>
          </InputWrapper>

          <SendButton
            onClick={handleSendText}
            disabled={isLoading || (!inputText.trim() && !isRecording)}
            title="Send message"
          >
            {isLoading ? <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={20} />}
          </SendButton>
        </InputContainer>
      </RightPanel>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Container>
  );
};

export default Home;
