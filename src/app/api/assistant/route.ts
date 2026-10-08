import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type AssistantAction =
  | 'NONE'
  | 'TRIGGER_SOS'
  | 'CANCEL_SOS'
  | 'FAKE_CALL'
  | 'SIREN'
  | 'SAFE_WALK'
  | 'FIND_POLICE'
  | 'FIND_HOSPITAL'
  | 'SHOW_CONTACTS';

interface AssistantResponse {
  reply: string;
  action: AssistantAction;
  suggestedQuestions: string[];
  lang: 'en' | 'hi';
}

function detectLanguage(text: string): 'en' | 'hi' {
  // If more than 20% of chars are Devanagari, treat as Hindi
  const devanagari = (text.match(/[\u0900-\u097F]/g) || []).length;
  return devanagari / text.length > 0.15 ? 'hi' : 'en';
}

function evaluateSafetyIntent(message: string): AssistantResponse {
  const text = message.toLowerCase().trim();
  const lang = detectLanguage(message);

  // ── SOS / Emergency ──────────────────────────────────────────────────────
  if (
    text.includes('sos') ||
    text.includes('help') ||
    text.includes('emergency') ||
    text.includes('danger') ||
    text.includes('save me') ||
    text.includes('in trouble') ||
    text.includes('unsafe') ||
    text.includes('being followed') ||
    text.includes('being chased') ||
    text.includes('मदद') ||
    text.includes('बचाओ') ||
    text.includes('इमरजेंसी') ||
    text.includes('खतरा') ||
    text.includes('हेल्प') ||
    text.includes('खतरे') ||
    text.includes('पीछा')
  ) {
    return {
      reply:
        lang === 'hi'
          ? '🚨 SOS अलर्ट भेज रहे हैं! आपके गार्जियंस को आपकी लाइव लोकेशन भेजी जा रही है। शांत रहें — मदद आ रही है।'
          : '🚨 Triggering SOS alert now! Sending your live location to all primary guardians. Stay calm — help is on the way.',
      action: 'TRIGGER_SOS',
      suggestedQuestions:
        lang === 'hi'
          ? ['अलर्ट रद्द करें', 'सायरन बजाएं', 'पुलिस खोजें']
          : ['Cancel alert', 'Play siren', 'Find nearest police'],
      lang,
    };
  }

  // ── Cancel / Safe ─────────────────────────────────────────────────────────
  if (
    text.includes('cancel') ||
    text.includes('i am safe') ||
    text.includes("i'm safe") ||
    text.includes('false alarm') ||
    text.includes('stop alert') ||
    text.includes('सुरक्षित') ||
    text.includes('ठीक हूँ') ||
    text.includes('ठीक हूं') ||
    text.includes('अलर्ट बंद') ||
    text.includes('रद्द')
  ) {
    return {
      reply:
        lang === 'hi'
          ? '✅ अलर्ट रद्द कर दिया गया है। खुशी है कि आप सुरक्षित हैं! अगर कुछ और चाहिए तो बताएं।'
          : '✅ Alert cancelled. So glad you are safe! Let me know if you need anything else.',
      action: 'CANCEL_SOS',
      suggestedQuestions:
        lang === 'hi'
          ? ['सेफवॉक शुरू करें', 'नज़दीकी सुरक्षित जगह', 'संपर्क दिखाएं']
          : ['Start SafeWalk', 'Find safe place', 'Show my contacts'],
      lang,
    };
  }

  // ── Fake Call ─────────────────────────────────────────────────────────────
  if (
    text.includes('fake call') ||
    text.includes('call me') ||
    text.includes('fake phone') ||
    text.includes('escape') ||
    text.includes('get out') ||
    text.includes('फेक कॉल') ||
    text.includes('नकली कॉल') ||
    text.includes('कॉल करो') ||
    text.includes('फोन करो') ||
    text.includes('बहाना')
  ) {
    return {
      reply:
        lang === 'hi'
          ? '📞 नकली कॉल शुरू हो रही है! इससे आप किसी असुरक्षित जगह से निकल सकते हैं।'
          : '📞 Starting a fake incoming call now! Use it to excuse yourself from any uncomfortable situation.',
      action: 'FAKE_CALL',
      suggestedQuestions:
        lang === 'hi'
          ? ['सायरन बजाएं', 'SOS भेजें', 'सेफ जगह खोजें']
          : ['Play siren', 'Send SOS', 'Find safe place'],
      lang,
    };
  }

  // ── Siren / Alarm ─────────────────────────────────────────────────────────
  if (
    text.includes('siren') ||
    text.includes('alarm') ||
    text.includes('loud') ||
    text.includes('noise') ||
    text.includes('sound') ||
    text.includes('सायरन') ||
    text.includes('अलार्म') ||
    text.includes('तेज आवाज') ||
    text.includes('शोर')
  ) {
    return {
      reply:
        lang === 'hi'
          ? '🔊 सायरन बज रहा है! यह आवाज़ ध्यान आकर्षित करने में मदद करेगी।'
          : '🔊 Activating loud siren now! This will attract attention in your area.',
      action: 'SIREN',
      suggestedQuestions:
        lang === 'hi'
          ? ['सायरन बंद करें', 'SOS भेजें', 'पुलिस खोजें']
          : ['Stop siren', 'Send SOS', 'Find police'],
      lang,
    };
  }

  // ── SafeWalk ──────────────────────────────────────────────────────────────
  if (
    text.includes('safe walk') ||
    text.includes('safewalk') ||
    text.includes('start walk') ||
    text.includes('track') ||
    text.includes('journey') ||
    text.includes('going home') ||
    text.includes('walking') ||
    text.includes('travel') ||
    text.includes('सेफ वॉक') ||
    text.includes('सफर') ||
    text.includes('रास्ता') ||
    text.includes('घर जा रही') ||
    text.includes('चलना')
  ) {
    return {
      reply:
        lang === 'hi'
          ? '🚶‍♀️ SafeWalk शुरू करने के लिए नीचे SafeWalk सेक्शन में जाएं और मंज़िल चुनें। आपके गार्जियंस आपको ट्रैक कर सकेंगे।'
          : '🚶‍♀️ To start SafeWalk, scroll down to the SafeWalk section and set your destination. Your guardians will track you in real time.',
      action: 'SAFE_WALK',
      suggestedQuestions:
        lang === 'hi'
          ? ['SOS भेजें', 'नज़दीकी पुलिस', 'इमरजेंसी नंबर']
          : ['Send SOS', 'Find nearest police', 'Emergency numbers'],
      lang,
    };
  }

  // ── Police ────────────────────────────────────────────────────────────────
  if (
    text.includes('police') ||
    text.includes('cops') ||
    text.includes('station') ||
    text.includes('pcr') ||
    text.includes('पुलिस') ||
    text.includes('थाना') ||
    text.includes('पीसीआर')
  ) {
    return {
      reply:
        lang === 'hi'
          ? '🚔 नज़दीकी पुलिस स्टेशन मैप पर दिखाए जा रहे हैं। इमरजेंसी के लिए सीधे **112** डायल करें।'
          : '🚔 Showing nearby police stations on the map. For immediate emergency, dial **112** directly.',
      action: 'FIND_POLICE',
      suggestedQuestions:
        lang === 'hi'
          ? ['112 पर कॉल करें', 'SOS भेजें', 'अस्पताल खोजें']
          : ['Call 112', 'Send SOS', 'Find hospital'],
      lang,
    };
  }

  // ── Hospital / Medical ────────────────────────────────────────────────────
  if (
    text.includes('hospital') ||
    text.includes('doctor') ||
    text.includes('medical') ||
    text.includes('ambulance') ||
    text.includes('injured') ||
    text.includes('hurt') ||
    text.includes('अस्पताल') ||
    text.includes('डॉक्टर') ||
    text.includes('दवा') ||
    text.includes('चोट') ||
    text.includes('एम्बुलेंस')
  ) {
    return {
      reply:
        lang === 'hi'
          ? '🏥 नज़दीकी अस्पताल मैप पर दिखाए जा रहे हैं। एम्बुलेंस के लिए **102** या **108** डायल करें।'
          : '🏥 Showing nearest hospitals on the map. For ambulance, dial **102** or **108** immediately.',
      action: 'FIND_HOSPITAL',
      suggestedQuestions:
        lang === 'hi'
          ? ['102 पर कॉल करें', 'SOS भेजें', 'पुलिस खोजें']
          : ['Call 102', 'Send SOS', 'Find police'],
      lang,
    };
  }

  // ── Contacts ──────────────────────────────────────────────────────────────
  if (
    text.includes('contact') ||
    text.includes('guardian') ||
    text.includes('family') ||
    text.includes('call someone') ||
    text.includes('संपर्क') ||
    text.includes('गार्जियन') ||
    text.includes('परिवार') ||
    text.includes('किसी को बुलाओ')
  ) {
    return {
      reply:
        lang === 'hi'
          ? '👥 आपके इमरजेंसी संपर्क नीचे दिखाए जा रहे हैं। आप किसी भी संपर्क को सीधे कॉल कर सकते हैं।'
          : '👥 Showing your emergency contacts below. You can call any contact directly.',
      action: 'SHOW_CONTACTS',
      suggestedQuestions:
        lang === 'hi'
          ? ['SOS भेजें', 'नया संपर्क जोड़ें', 'सेफवॉक शुरू करें']
          : ['Send SOS', 'Add new contact', 'Start SafeWalk'],
      lang,
    };
  }

  // ── Safety Tips ───────────────────────────────────────────────────────────
  if (
    text.includes('tip') ||
    text.includes('advice') ||
    text.includes('safe') ||
    text.includes('protect') ||
    text.includes('सुझाव') ||
    text.includes('सलाह') ||
    text.includes('सुरक्षा')
  ) {
    const tips =
      lang === 'hi'
        ? [
            '🛡️ यहाँ कुछ सुरक्षा सुझाव हैं:\n\n• अकेले रात को बाहर जाते समय SafeWalk चालू करें\n• अपने प्राथमिक संपर्कों को हमेशा अपडेट रखें\n• किसी असुरक्षित जगह से बचने के लिए फेक कॉल का उपयोग करें\n• हमेशा अच्छी रोशनी वाली जगहों पर चलें\n• अजनबियों से सावधान रहें और भीड़-भाड़ वाली जगहों पर रहें',
          ]
        : [
            '🛡️ Here are some safety tips:\n\n• Enable SafeWalk whenever you travel alone at night\n• Keep your primary emergency contacts updated\n• Use Fake Call to excuse yourself from uncomfortable situations\n• Always walk in well-lit, busy areas\n• Trust your instincts — if something feels wrong, leave immediately',
          ];

    return {
      reply: tips[0],
      action: 'NONE',
      suggestedQuestions:
        lang === 'hi'
          ? ['सेफवॉक शुरू करें', 'संपर्क अपडेट करें', 'SOS टेस्ट करें']
          : ['Start SafeWalk', 'Update contacts', 'Test SOS'],
      lang,
    };
  }

  // ── Emergency Numbers ─────────────────────────────────────────────────────
  if (
    text.includes('number') ||
    text.includes('helpline') ||
    text.includes('hotline') ||
    text.includes('dial') ||
    text.includes('call') ||
    text.includes('नंबर') ||
    text.includes('हेल्पलाइन')
  ) {
    return {
      reply:
        lang === 'hi'
          ? '📞 **भारत में आपातकालीन नंबर:**\n\n• 📟 **112** — राष्ट्रीय आपातकाल\n• 👮 **100** — पुलिस\n• 🚒 **101** — दमकल\n• 🚑 **102 / 108** — एम्बुलेंस\n• 👩 **1091** — महिला हेल्पलाइन\n• 💛 **1098** — चाइल्ड हेल्पलाइन'
          : '📞 **India Emergency Numbers:**\n\n• 📟 **112** — National Emergency\n• 👮 **100** — Police\n• 🚒 **101** — Fire\n• 🚑 **102 / 108** — Ambulance\n• 👩 **1091** — Women Helpline\n• 💛 **1098** — Childline',
      action: 'NONE',
      suggestedQuestions:
        lang === 'hi'
          ? ['SOS भेजें', 'पुलिस खोजें', 'अस्पताल खोजें']
          : ['Send SOS', 'Find police', 'Find hospital'],
      lang,
    };
  }

  // ── Greeting ──────────────────────────────────────────────────────────────
  if (
    text.includes('hello') ||
    text.includes('hi') ||
    text.includes('hey') ||
    text.includes('namaste') ||
    text.includes('नमस्ते') ||
    text.includes('हेलो') ||
    text.includes('हाय') ||
    text === ''
  ) {
    return {
      reply:
        lang === 'hi'
          ? '🌸 नमस्ते! मैं SafeHer का AI सहायक हूँ। मैं आपको इमरजेंसी अलर्ट, नकली कॉल, साइरन, SafeWalk और सुरक्षा सुझावों में मदद कर सकता हूँ। आप हिंदी या अंग्रेज़ी में बात कर सकते हैं।'
          : '🌸 Hello! I\'m SafeHer\'s AI safety assistant. I can help you trigger SOS, make a fake call, activate a siren, start SafeWalk, find police & hospitals, and share safety tips. Ask me anything in English or Hindi!',
      action: 'NONE',
      suggestedQuestions:
        lang === 'hi'
          ? ['SOS भेजें', 'फेक कॉल करें', 'सेफवॉक शुरू करें', 'सुरक्षा सुझाव']
          : ['Send SOS', 'Fake call', 'Start SafeWalk', 'Safety tips'],
      lang,
    };
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return {
    reply:
      lang === 'hi'
        ? `मुझे समझ नहीं आया: "${message}"\n\nमैं इन विषयों पर मदद कर सकता हूँ: SOS, फेक कॉल, सायरन, SafeWalk, पुलिस/अस्पताल खोजना, और सुरक्षा सुझाव।`
        : `I didn't quite understand: "${message}"\n\nI can help with: SOS alerts, fake calls, siren, SafeWalk, finding police/hospitals, and safety tips. Try asking in a different way.`,
    action: 'NONE',
    suggestedQuestions:
      lang === 'hi'
        ? ['SOS भेजें', 'सेफवॉक शुरू करें', 'इमरजेंसी नंबर', 'सुरक्षा सुझाव']
        : ['Send SOS', 'Start SafeWalk', 'Emergency numbers', 'Safety tips'],
    lang,
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const result = evaluateSafetyIntent(message.trim());
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
