// 简易语音识别封装（Web Speech API）
// 兼容 Chrome 的 webkitSpeechRecognition；Safari 等支持度有限。

export function isSpeechSupported() {
  return (
    typeof window !== "undefined" &&
    (!!window.SpeechRecognition || !!window.webkitSpeechRecognition)
  );
}

export function createSpeechRecognition(options = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;

  const {
    lang = "zh-CN",
    interimResults = true,
    continuous = false,
    maxAlternatives = 1,
  } = options;

  const rec = new SR();
  rec.lang = lang;
  rec.interimResults = interimResults;
  rec.continuous = continuous;
  rec.maxAlternatives = maxAlternatives;
  return rec;
}
