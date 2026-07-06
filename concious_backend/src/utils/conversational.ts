function normalizeMessage(message: string) {
  return message
    .trim()
    .toLowerCase()
    .replace(/[!?.…,]+$/g, "")
    .replace(/\s+/g, " ");
}

const EXACT_GENERAL_PATTERNS = [
  /^(hi+|hey+|hello+|hola|yo|sup|wassup|what'?s up|whats up)$/,
  /^(good\s+(morning|afternoon|evening|night))$/,
  /^(gm|gn)$/,
  /^(thanks|thank you|thx|ty)$/,
  /^(bye+|goodbye|see ya|cya)$/,
  /^(how are you|how r u|how'?s it going|how are u)$/,
  /^(what can you do|who are you|help|help me)$/,
  /^(ok|okay|cool|nice|great|awesome|lol|haha)$/,
];

const GREETING_PREFIX =
  /^(hi+|hey+|hello+|good\s+(morning|afternoon|evening|night))\b/;

export function isGeneralConversation(message: string) {
  const normalized = normalizeMessage(message);
  if (!normalized) {
    return false;
  }

  if (normalized.length > 72) {
    return false;
  }

  if (EXACT_GENERAL_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return true;
  }

  const wordCount = normalized.split(" ").length;
  if (wordCount <= 5 && GREETING_PREFIX.test(normalized)) {
    return true;
  }

  if (
    wordCount <= 4 &&
    /^(thanks|thank you|bye|goodbye)\b/.test(normalized)
  ) {
    return true;
  }

  return false;
}

export function shouldUseStaticGeneralResponse(message: string) {
  const normalized = normalizeMessage(message);
  return /^(thanks|thank you|thx|ty|bye+|goodbye|see ya|cya|what can you do|who are you|help)\b/.test(
    normalized
  );
}

export function getStaticGeneralResponse(message: string) {
  const normalized = normalizeMessage(message);

  if (/^(thanks|thank you|thx|ty)\b/.test(normalized)) {
    return "You're welcome. Whenever you want to explore your saved brain, just ask.";
  }

  if (/^(bye+|goodbye|see ya|cya)\b/.test(normalized)) {
    return "Take your time — I'll be here when you want to dig into your saved content again.";
  }

  if (/how/.test(normalized) && /(you|going|u)/.test(normalized)) {
    return "I'm doing well, thanks for asking. I'm ready to help you explore your saved videos, articles, playlists, and notes. What would you like to look at?";
  }

  if (/what can you do|who are you|help/.test(normalized)) {
    return "I'm Ashqnor — your grounded assistant for Conscious. I read your saved content and help you recall patterns, summarize what you've stored, and connect ideas across videos, articles, music, and notes.";
  }

  if (/^(ok|okay|cool|nice|great|awesome|lol|haha)\b/.test(normalized)) {
    return "Glad that landed. Ask me anything about what you've saved and I'll pull from your brain.";
  }

  return "Hey — I'm Ashqnor. I can help you explore your saved videos, articles, Spotify picks, and notes. What would you like to talk about?";
}
