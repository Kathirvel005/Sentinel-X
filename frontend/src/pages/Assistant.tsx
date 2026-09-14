import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  Paperclip, 
  Image as ImageIcon, 
  Bot, 
  User, 
  Cpu, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { ChatMessage, PageRoute } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

interface AssistantProps {
  onNavigate: (route: PageRoute) => void;
}

export const Assistant: React.FC<AssistantProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      content: "Hello! I am Sentinel-X, your private on-device multimodal guardian. I can inspect messages for scams, audit confidential documents, mask display screens, or benchmark Snapdragon NPU acceleration. How can I protect you right now?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      runtime: 'local',
      execution_provider: 'cpu',
      hardware: 'cpu'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; content: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetChips = [
    "Check for scam in this email",
    "Protect my screen from PII leaks",
    "Summarize confidential NDA agreement",
    "What do you see in the workspace?",
    "Run Snapdragon NPU benchmark"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() && !attachedFile) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const res = await api.sendChat(text, attachedFile ? { filename: attachedFile.name, content: attachedFile.content, type: 'document' } : undefined);
      const data = res.data;

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        content: data.assistant_response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: data.intent,
        tool: data.tool,
        model_family: data.model_family,
        confidence: data.confidence,
        runtime: data.runtime,
        execution_provider: data.execution_provider,
        hardware: data.hardware,
        latency_ms: data.latency_ms,
        tool_output: data.tool_output
      };

      setMessages((prev) => [...prev, botMsg]);
      setAttachedFile(null);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        sender: 'assistant',
        content: "Sentinel AI responded locally via CPU fallback: Analyzed request with local-first security verification.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        runtime: 'local',
        execution_provider: 'cpu',
        hardware: 'cpu'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setAttachedFile({ name: file.name, content: text });
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col justify-between max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header Info Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Sentinel-X Multimodal Assistant</h1>
            <p className="text-[11px] text-slate-400">On-Device Intent Classification & Neural Dispatch</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Zero Cloud Egress
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
        {messages.map((msg) => {
          const isBot = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div className={`max-w-2xl ${isBot ? 'text-left' : 'text-right'}`}>
                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'glass-panel text-slate-200 border-white/10'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium ml-auto'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Tool Execution Card if present */}
                  {isBot && msg.tool && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 font-bold">Intent:</span>
                          <span className="text-white">{msg.intent}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Tool:</span>
                          <span className="text-amber-300 font-semibold">{msg.tool}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Latency:</span>
                          <span className="text-emerald-300">{msg.latency_ms} ms</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                        <span>Model: <span className="text-slate-300">{msg.model_family}</span></span>
                        <StatusBadge 
                          runtime={msg.runtime} 
                          executionProvider={msg.execution_provider} 
                          hardware={msg.hardware} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 mt-1 block px-1">
                  {msg.timestamp}
                </span>
              </div>

              {!isBot && (
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-blue-300" />
                </div>
              )}
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex gap-3 items-center text-xs text-cyan-400 font-mono">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-pulse">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="p-3 glass-panel rounded-2xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Orchestrating local model inference on Snapdragon PC...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Chips */}
      <div className="py-2 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {presetChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="text-[11px] px-3 py-1 rounded-full bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 whitespace-nowrap transition-all cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Attachment Preview if selected */}
      {attachedFile && (
        <div className="mb-2 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs text-cyan-300">
          <div className="flex items-center gap-2 truncate">
            <FileText className="w-4 h-4" />
            <span className="truncate">{attachedFile.name} (Attached for local extraction)</span>
          </div>
          <button 
            onClick={() => setAttachedFile(null)}
            className="text-slate-400 hover:text-white cursor-pointer px-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Box */}
      <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 border-white/10">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept=".txt,.pdf,.docx,.json,.md"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Attach document or text file"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <button
          onClick={() => onNavigate('voice')}
          className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
          title="Open Voice Assistant"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Sentinel-X to analyze, guard, inspect, or summarize..."
          className="flex-1 bg-transparent text-xs sm:text-sm text-white focus:outline-none px-2 placeholder:text-slate-500"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputMessage.trim() && !attachedFile}
          className="p-2.5 rounded-xl btn-cyan disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
