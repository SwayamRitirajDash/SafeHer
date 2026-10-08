export type VoiceCommandAction =
  | { type: 'TRIGGER_SOS' }
  | { type: 'SPEAK_LOCATION' }
  | { type: 'FAKE_CALL' }
  | { type: 'SIREN' }
  | { type: 'SAFE_WALK' }
  | { type: 'FIND_POLICE' }
  | { type: 'FIND_HOSPITAL' }
  | { type: 'RESOLVE_SOS' }
  | { type: 'SHOW_CONTACTS' }
  | { type: 'UNKNOWN'; query: string };

export class SafeSpeechEngine {
  private recognition: any = null;
  private isListening: boolean = false;
  private isActuallyRunning: boolean = false;
  private isSpeaking: boolean = false;
  private language: 'en-IN' | 'hi-IN' = 'en-IN';
  private onTranscriptCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private silenceTimer: any = null;
  private latestTranscript: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.language;

        this.recognition.onstart = () => {
          this.isActuallyRunning = true;
        };

        this.recognition.onresult = (event: any) => {
          // If speech synthesis is currently active, ignore mic input to avoid audio feedback
          if (this.isSpeaking) return;

          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const currentText = (finalTranscript || interimTranscript).trim();
          if (currentText) {
            this.latestTranscript = currentText;
            if (this.onTranscriptCallback) {
              this.onTranscriptCallback(currentText, Boolean(finalTranscript));
            }

            // Reset silence timer on every new speech token
            if (this.silenceTimer) clearTimeout(this.silenceTimer);

            // If browser provided final transcript or user paused for 1.3s, commit speech
            if (finalTranscript) {
              if (this.onTranscriptCallback) {
                this.onTranscriptCallback(finalTranscript, true);
              }
              this.latestTranscript = '';
            } else {
              this.silenceTimer = setTimeout(() => {
                if (this.latestTranscript && this.onTranscriptCallback) {
                  this.onTranscriptCallback(this.latestTranscript, true);
                  this.latestTranscript = '';
                }
              }, 1400);
            }
          }
        };

        this.recognition.onerror = (event: any) => {
          // Ignore non-fatal 'no-speech' or 'aborted'
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            console.warn('Speech recognition status:', event.error);
            if (this.onErrorCallback) {
              this.onErrorCallback(event.error);
            }
          }
        };

        this.recognition.onend = () => {
          this.isActuallyRunning = false;
          // Auto-restart recognition only if active and not currently speaking
          if (this.isListening && !this.isSpeaking) {
            try {
              this.recognition.start();
            } catch (e) {}
          }
        };
      }
    }
  }

  public setLanguage(lang: 'en-IN' | 'hi-IN'): void {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public getLanguage(): 'en-IN' | 'hi-IN' {
    return this.language;
  }

  public isSupported(): boolean {
    return Boolean(this.recognition);
  }

  public startListening(
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void,
    lang?: 'en-IN' | 'hi-IN'
  ): boolean {
    if (!this.recognition) return false;
    if (lang) this.setLanguage(lang);

    this.onTranscriptCallback = onTranscript;
    if (onError) this.onErrorCallback = onError;

    this.isListening = true;
    this.latestTranscript = '';

    if (this.isActuallyRunning || this.isSpeaking) {
      return true;
    }

    try {
      this.recognition.start();
      return true;
    } catch (e: any) {
      if (e.name === 'InvalidStateError') {
        this.isActuallyRunning = true;
        return true;
      }
      console.warn('Speech recognition start note:', e);
      return false;
    }
  }

  public stopListening(): void {
    this.isListening = false;
    this.isActuallyRunning = false;
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }

  /**
   * High-reliability speech synthesizer with Chrome GC protection and voice selection
   */
  public speak(text: string, onEnd?: () => void, lang?: 'en-IN' | 'hi-IN'): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    this.isSpeaking = true;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Retain global reference to prevent Chrome GC bug where utterance stops firing onend
    (window as any).__safeHerActiveUtterance = utterance;

    const targetLang = lang || this.language;
    utterance.lang = targetLang;
    utterance.rate = 0.96;
    utterance.pitch = 1.02;

    const selectAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      if (targetLang === 'hi-IN') {
        const hindiVoice = voices.find(
          (v) =>
            v.lang.startsWith('hi') ||
            v.name.toLowerCase().includes('hindi') ||
            v.name.toLowerCase().includes('india')
        );
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        const englishVoice =
          voices.find(
            (v) =>
              v.lang === 'en-IN' ||
              v.name.includes('India') ||
              (v.lang.startsWith('en') && v.name.includes('Female'))
          ) || voices.find((v) => v.lang.startsWith('en'));
        if (englishVoice) utterance.voice = englishVoice;
      }

      utterance.onend = () => {
        this.isSpeaking = false;
        (window as any).__safeHerActiveUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        (window as any).__safeHerActiveUtterance = null;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        selectAndSpeak();
      };
    } else {
      selectAndSpeak();
    }
  }

  public stopSpeaking(): void {
    this.isSpeaking = false;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  public parseCommand(phrase: string): VoiceCommandAction {
    const text = phrase.toLowerCase().trim();

    // Emergency / SOS (English & Hindi)
    if (
      text.includes('help') ||
      text.includes('sos') ||
      text.includes('emergency') ||
      text.includes('danger') ||
      text.includes('save me') ||
      text.includes('मदद') ||
      text.includes('बचाओ') ||
      text.includes('इमरजेंसी') ||
      text.includes('खतरा') ||
      text.includes('हेल्प')
    ) {
      return { type: 'TRIGGER_SOS' };
    }

    // Location (English & Hindi)
    if (
      text.includes('where am i') ||
      text.includes('my location') ||
      text.includes('current location') ||
      text.includes('address') ||
      text.includes('लोकेशन') ||
      text.includes('कहाँ हूँ') ||
      text.includes('कहाँ हूं') ||
      text.includes('पता') ||
      text.includes('जगह')
    ) {
      return { type: 'SPEAK_LOCATION' };
    }

    // Fake Call (English & Hindi)
    if (
      text.includes('fake call') ||
      text.includes('call me') ||
      text.includes('escape') ||
      text.includes('फेक कॉल') ||
      text.includes('नकली कॉल') ||
      text.includes('कॉल करो') ||
      text.includes('फोन करो')
    ) {
      return { type: 'FAKE_CALL' };
    }

    // Siren (English & Hindi)
    if (
      text.includes('siren') ||
      text.includes('alarm') ||
      text.includes('loud sound') ||
      text.includes('सायरन') ||
      text.includes('अलार्म') ||
      text.includes('आवाज')
    ) {
      return { type: 'SIREN' };
    }

    // SafeWalk (English & Hindi)
    if (
      text.includes('safe walk') ||
      text.includes('start walk') ||
      text.includes('track journey') ||
      text.includes('सेफ वॉक') ||
      text.includes('सफर') ||
      text.includes('रास्ता')
    ) {
      return { type: 'SAFE_WALK' };
    }

    // Police (English & Hindi)
    if (
      text.includes('police') ||
      text.includes('cops') ||
      text.includes('station') ||
      text.includes('पुलिस') ||
      text.includes('थाना')
    ) {
      return { type: 'FIND_POLICE' };
    }

    // Hospital (English & Hindi)
    if (
      text.includes('hospital') ||
      text.includes('doctor') ||
      text.includes('medical') ||
      text.includes('अस्पताल') ||
      text.includes('डॉक्टर') ||
      text.includes('दवा')
    ) {
      return { type: 'FIND_HOSPITAL' };
    }

    // Safe status (English & Hindi)
    if (
      text.includes('i am safe') ||
      text.includes("i'm safe") ||
      text.includes('cancel sos') ||
      text.includes('सुरक्षित') ||
      text.includes('ठीक हूँ') ||
      text.includes('ठीक हूं') ||
      text.includes('अलर्ट बंद')
    ) {
      return { type: 'RESOLVE_SOS' };
    }

    return { type: 'UNKNOWN', query: phrase };
  }
}

export const safeSpeech = new SafeSpeechEngine();
