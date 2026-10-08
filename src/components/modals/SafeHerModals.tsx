'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Flame, Check, Mic, MicOff, Send, X, MessageSquare, Trash2, Volume2 } from 'lucide-react';
import { useSafeHerStore } from '@/lib/store';
import { safeAudio } from '@/lib/audio';
import { safeSpeech } from '@/lib/speech';
import { AuthModal } from '@/components/auth/AuthModal';

/* ──────────────────────────────────────────────────────────────────────────
   SOS COUNTDOWN + CHATBOT + AUTH MODALS
────────────────────────────────────────────────────────────────────────── */

export const SafeHerModals: React.FC = () => {
  // ── Store ──────────────────────────────────────────────────────────────
  const isSOSCountdownOpen  = useSafeHerStore((s) => s.isSOSCountdownOpen);
  const setSOSCountdownOpen = useSafeHerStore((s) => s.setSOSCountdownOpen);
  const triggerSOS          = useSafeHerStore((s) => s.triggerSOS);
  const cancelSOS           = useSafeHerStore((s) => s.cancelSOS);

  const isChatOpen      = useSafeHerStore((s) => s.isChatOpen);
  const setChatOpen     = useSafeHerStore((s) => s.setChatOpen);
  const chatMessages    = useSafeHerStore((s) => s.chatMessages);
  const addChatMessage  = useSafeHerStore((s) => s.addChatMessage);
  const clearChatMessages = useSafeHerStore((s) => s.clearChatMessages);

  // ── SOS Countdown state ────────────────────────────────────────────────
  const [count, setCount]       = useState<number>(5);
  const [isSOSSent, setIsSOSSent] = useState<boolean>(false);

  useEffect(() => {
    if (!isSOSCountdownOpen) { setCount(5); setIsSOSSent(false); return; }
    setCount(5); setIsSOSSent(false);
    safeAudio.playBeep(880, 100);
    const interval = setInterval(() => {
      setCount((prev) => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSOSCountdownOpen]);

  useEffect(() => {
    if (isSOSCountdownOpen) {
      if (count === 0 && !isSOSSent) { setIsSOSSent(true); triggerSOS(); }
      else if (count > 0 && count < 5) { safeAudio.playBeep(880 + (5 - count) * 100, 120); }
    }
  }, [count, isSOSCountdownOpen, isSOSSent, triggerSOS]);

  return (
    <>
      {/* ──── SOS Countdown ──── */}
      {isSOSCountdownOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-satoshi">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-2xl text-center space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-current text-black" />
                Emergency Distress Alert
              </span>
              <button onClick={() => setSOSCountdownOpen(false)} className="text-xs font-bold text-[#6B7280] hover:text-black p-1 cursor-pointer">✕</button>
            </div>
            {!isSOSSent ? (
              <div className="space-y-4">
                <div className="w-24 h-24 rounded-full bg-[#F3F4F6] border-2 border-black flex items-center justify-center mx-auto text-4xl font-general font-bold text-black animate-pulse">{count}</div>
                <div>
                  <h3 className="font-general font-bold text-xl text-black">Dispatching Live Coordinates</h3>
                  <p className="text-xs text-[#6B7280] mt-1 max-w-xs mx-auto">Live GPS link and emergency broadcast will be sent to your primary guardians.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#F0FDF4] border border-[#22C55E] flex items-center justify-center mx-auto text-[#22C55E]">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-general font-bold text-xl text-black">Alert Dispatched to Guardians</h3>
                  <p className="text-xs text-[#6B7280] mt-1">Emergency coordinates sent via SMS and WhatsApp.</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => setSOSCountdownOpen(false)} className="h-12 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-black transition-colors cursor-pointer">Cancel / False Alarm</button>
              <button onClick={() => { triggerSOS(); setIsSOSSent(true); }} className="h-12 rounded-xl bg-black hover:bg-[#262626] text-xs font-semibold text-white transition-colors cursor-pointer">Send Now</button>
            </div>
          </div>
        </div>
      )}

      {/* ──── Voice Chatbot ──── */}
      {isChatOpen && (
        <ChatbotModal
          chatMessages={chatMessages}
          addChatMessage={addChatMessage}
          clearChatMessages={clearChatMessages}
          onClose={() => setChatOpen(false)}
          triggerSOS={triggerSOS}
          cancelSOS={cancelSOS}
        />
      )}

      {/* ──── Authentication Modal (Sign In / Sign Up) ──── */}
      <AuthModal />
    </>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   CHATBOT MODAL
────────────────────────────────────────────────────────────────────────── */

interface ChatMessage { id: string; sender: 'user' | 'bot'; text: string; timestamp: string; action?: string; }

interface ChatbotModalProps {
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatMessages: () => void;
  onClose: () => void;
  triggerSOS: () => void;
  cancelSOS: () => void;
}

const QUICK_SUGGESTIONS_EN = ['Send SOS 🚨', 'Fake call 📞', 'Safety tips 🛡️', 'Emergency numbers 📟', 'Find police 🚔'];
const QUICK_SUGGESTIONS_HI = ['SOS भेजें 🚨', 'फेक कॉल 📞', 'सुरक्षा सुझाव 🛡️', 'इमरजेंसी नंबर 📟', 'पुलिस खोजें 🚔'];

const GREETING_EN = "🌸 Hi! I'm your SafeHer assistant. Ask me anything in English or Hindi — I can trigger SOS, make a fake call, activate a siren, start SafeWalk, or share safety tips. Use the mic or type below.";
const GREETING_HI = "🌸 नमस्ते! मैं आपका SafeHer सहायक हूँ। हिंदी या अंग्रेज़ी में पूछें — मैं SOS, फेक कॉल, सायरन, SafeWalk और सुरक्षा सुझावों में मदद करूँगा।";

function ChatbotModal({ chatMessages, addChatMessage, clearChatMessages, onClose, triggerSOS, cancelSOS }: ChatbotModalProps) {
  const [inputText, setInputText]   = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang]   = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [liveText, setLiveText]     = useState('');
  const messagesEndRef              = useRef<HTMLDivElement>(null);
  const inputRef                    = useRef<HTMLInputElement>(null);
  const hasGreeted                  = useRef(false);

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, liveText]);

  // Greet on open
  useEffect(() => {
    if (!hasGreeted.current && chatMessages.length === 0) {
      hasGreeted.current = true;
      addChatMessage({ sender: 'bot', text: GREETING_EN });
    }
  }, [addChatMessage, chatMessages.length]);

  // ── Execute action from bot response ──────────────────────────────────
  const executeAction = useCallback((action: string) => {
    switch (action) {
      case 'TRIGGER_SOS': triggerSOS(); break;
      case 'CANCEL_SOS':  cancelSOS();  break;
      case 'FAKE_CALL':   safeAudio.startRingtone(); break;
      case 'SIREN':       safeAudio.startSiren();    break;
      default: break;
    }
  }, [triggerSOS, cancelSOS]);

  // ── Send message ───────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    addChatMessage({ sender: 'user', text: trimmed });
    setInputText('');
    setLiveText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      const reply: string = data.reply || 'Sorry, something went wrong.';
      const action: string = data.action || 'NONE';

      addChatMessage({ sender: 'bot', text: reply, action });
      executeAction(action);

      // TTS: speak the bot reply
      const ttsLang = (data.lang === 'hi') ? 'hi-IN' : 'en-IN';
      // Strip emoji and markdown for cleaner TTS
      const speakText = reply.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
      safeSpeech.speak(speakText, undefined, ttsLang);
    } catch {
      addChatMessage({ sender: 'bot', text: '⚠️ Could not reach the assistant. Please check your connection.' });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addChatMessage, executeAction]);

  // ── Voice toggle ───────────────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    if (isListening) {
      safeSpeech.stopListening();
      setIsListening(false);
      setLiveText('');
    } else {
      if (!safeSpeech.isSupported()) {
        alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
        return;
      }
      setIsListening(true);
      setLiveText('');
      safeSpeech.startListening(
        (transcript, isFinal) => {
          setLiveText(transcript);
          if (isFinal && transcript.trim()) {
            safeSpeech.stopListening();
            setIsListening(false);
            sendMessage(transcript);
          }
        },
        (err) => { console.warn('Voice error:', err); setIsListening(false); setLiveText(''); },
        voiceLang
      );
    }
  }, [isListening, sendMessage, voiceLang]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputText); }
  };

  const suggestions = voiceLang === 'hi-IN' ? QUICK_SUGGESTIONS_HI : QUICK_SUGGESTIONS_EN;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm font-satoshi">
      <div className="w-full sm:max-w-md h-[90vh] sm:h-[600px] bg-white sm:rounded-3xl flex flex-col border border-[#E5E7EB] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6] bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-black font-general">SafeHer Assistant</p>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-widest font-medium">
                {isListening ? '🎙️ Listening…' : 'AI Safety Chatbot'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setVoiceLang(v => v === 'en-IN' ? 'hi-IN' : 'en-IN')}
              className="h-8 px-3 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[11px] font-bold text-[#374151] transition-colors cursor-pointer"
            >
              {voiceLang === 'en-IN' ? 'हिंदी' : 'English'}
            </button>
            <button onClick={() => { clearChatMessages(); hasGreeted.current = false; }} title="Clear chat" className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-black transition-colors cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-black transition-colors cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#FAFAFA]">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-black text-white rounded-br-md'
                  : 'bg-white text-black border border-[#E5E7EB] rounded-bl-md shadow-sm'
              }`}>
                {msg.text}
                <div className={`text-[9px] mt-1.5 ${msg.sender === 'user' ? 'text-white/50 text-right' : 'text-[#9CA3AF]'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Live voice transcript bubble */}
          {isListening && liveText && (
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-3 text-sm bg-black/10 text-[#374151] italic border border-dashed border-[#9CA3AF]">
                {liveText}…
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto flex-shrink-0 border-t border-[#F3F4F6] bg-white scrollbar-hide">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim())}
              className="flex-shrink-0 h-7 px-3 rounded-full border border-[#E5E7EB] bg-white hover:bg-black hover:text-white hover:border-black text-[11px] font-medium text-[#374151] transition-all cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="px-4 pb-5 pt-3 bg-white flex-shrink-0 border-t border-[#F3F4F6]">
          <div className="flex items-center gap-2">
            {/* Mic button */}
            <button
              onClick={toggleVoice}
              className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isListening
                  ? 'bg-black text-white animate-pulse'
                  : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151]'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text input */}
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={voiceLang === 'hi-IN' ? 'यहाँ टाइप करें या माइक दबाएं…' : 'Type a message or press mic…'}
              className="flex-1 h-11 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-sm text-black placeholder-[#9CA3AF] focus:outline-none focus:border-black focus:bg-white transition-all"
            />

            {/* Send / TTS info button */}
            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
              className="w-11 h-11 flex-shrink-0 rounded-xl bg-black hover:bg-[#262626] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] text-white flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-[#9CA3AF] mt-2 text-center flex items-center justify-center gap-1">
            <Volume2 className="w-3 h-3" /> Bot replies are spoken aloud automatically
          </p>
        </div>
      </div>
    </div>
  );
}
