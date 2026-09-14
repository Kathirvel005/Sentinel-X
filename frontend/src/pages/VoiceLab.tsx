import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Zap, 
  ShieldCheck, 
  Play, 
  Radio, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PageRoute } from '../types';
import { api } from '../services/api';
import { ThreeAiCore } from '../components/ThreeAiCore';

type VoiceState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR';

interface VoiceLabProps {
  onNavigate: (route: PageRoute) => void;
}

export const VoiceLab: React.FC<VoiceLabProps> = ({ onNavigate }) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [responseSpeech, setResponseSpeech] = useState(
    "Sentinel-X Voice Assistant is ready. Speak a command or click a preset below."
  );
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  const commandPresets = [
    { text: "Open security", target: 'security' as PageRoute },
    { text: "Scan this message", target: 'security' as PageRoute },
    { text: "Analyze document", target: 'documents' as PageRoute },
    { text: "Enable privacy mode", target: 'privacy' as PageRoute },
    { text: "Start camera", target: 'vision' as PageRoute },
    { text: "Show performance", target: 'performance' as PageRoute },
    { text: "Run benchmark", target: 'performance' as PageRoute }
  ];

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setVoiceState('LISTENING');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onend = () => {
        if (transcript) {
          handleExecuteVoice(transcript);
        } else {
          setVoiceState('IDLE');
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setVoiceState('IDLE');
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }
  }, [transcript]);

  const toggleListening = () => {
    if (voiceState === 'LISTENING') {
      recognitionRef.current?.stop();
      setVoiceState('IDLE');
    } else {
      setTranscript('');
      setVoiceState('LISTENING');
      try {
        recognitionRef.current?.start();
      } catch (e) {
        // Recognition already active or fallback
      }
    }
  };

  const handleExecuteVoice = async (text: string) => {
    setVoiceState('THINKING');
    try {
      const res = await api.processVoice(text);
      const data = res.data;
      setResponseSpeech(data.spoken_response);
      setVoiceState('SPEAKING');

      // Speak response aloud via local SpeechSynthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(data.spoken_response);
        utterance.rate = 1.05;
        utterance.onend = () => setVoiceState('IDLE');
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setVoiceState('IDLE'), 2500);
      }

      // If recognized routing command, navigate after short verbal confirmation
      if (data.recognized_command && data.target_route) {
        setTimeout(() => {
          onNavigate(data.target_route.replace('/', '') as PageRoute);
        }, 1800);
      }
    } catch (err) {
      setVoiceState('IDLE');
    }
  };

  const triggerPreset = (presetText: string) => {
    setTranscript(presetText);
    handleExecuteVoice(presetText);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto flex flex-col justify-between min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400" />
            Local Speech AI & Command Router
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Sentinel-X Voice Assistant
          </h1>
          <p className="text-xs text-slate-400">
            Offline voice recognition and synthesis. Voice samples are never transmitted over external networks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
            STATE: {voiceState}
          </span>
        </div>
      </div>

      {/* Center AI Orb & Waveform */}
      <div className="flex flex-col items-center justify-center my-auto space-y-6">
        <ThreeAiCore isProcessing={voiceState === 'LISTENING' || voiceState === 'SPEAKING'} size={240} />

        {/* Dynamic Voice Waveform Bars */}
        <div className="flex items-center gap-1.5 h-12">
          {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35, 65, 85].map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-200 ${
                voiceState === 'LISTENING'
                  ? 'bg-cyan-400 shadow-[0_0_8px_#00D2FF]'
                  : voiceState === 'SPEAKING'
                  ? 'bg-purple-400 shadow-[0_0_8px_#C084FC]'
                  : 'bg-white/10'
              }`}
              style={{
                height: (voiceState === 'LISTENING' || voiceState === 'SPEAKING')
                  ? `${Math.max(12, Math.sin(Date.now() / 150 + i) * h)}px`
                  : '10px'
              }}
            />
          ))}
        </div>

        {/* Spoken Response Box */}
        <div className="glass-panel p-5 rounded-2xl max-w-xl text-center space-y-2 border-white/10">
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest block">
            {voiceState === 'LISTENING' ? 'Listening to voice...' : 'Guardian Spoken Output'}
          </span>
          <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
            {transcript ? `"${transcript}"` : responseSpeech}
          </p>
        </div>

        {/* Mic Control Button */}
        <button
          onClick={toggleListening}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl ${
            voiceState === 'LISTENING'
              ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_25px_rgba(244,63,94,0.6)]'
              : 'btn-cyan text-black'
          }`}
        >
          {voiceState === 'LISTENING' ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
        </button>
      </div>

      {/* Quick Voice Command Chips */}
      <div className="pt-4 border-t border-white/5 space-y-2">
        <span className="text-xs text-slate-400 block text-center">Click or speak any guardian command:</span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {commandPresets.map((cmd, i) => (
            <button
              key={i}
              onClick={() => triggerPreset(cmd.text)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>"{cmd.text}"</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
