// Warasiga (وراسيگا) — hybrid AI receipt/document explainer in Moroccan Darija.
// Built for Firebase #BuildHybridAI 2026. Uses Firebase AI Logic with
// InferenceMode.PREFER_ON_DEVICE: Chrome's on-device Gemini (Prompt API) when
// available, cloud Gemini (Gemini Developer API) otherwise.

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-ai.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app-check.js";
import { firebaseConfig } from "./firebase-config.js";

// App Check (reCAPTCHA Enterprise) site key — public by design, domain-locked.
const APPCHECK_SITE_KEY = "6Lez3x8uAAAAAD8Mrl25hp52B-O83MCveRuxXGrl";

const app = initializeApp(firebaseConfig);

// On localhost, use the App Check debug provider: run the site once, copy the
// debug token printed in the console, and register it in the Firebase console
// (App Check > Apps > warasiga-web > debug tokens). Never commit a token here.
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}
try {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(APPCHECK_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
} catch (e) {
  console.warn("App Check init failed (continuing without):", e);
}

const ai = getAI(app, { backend: new GoogleAIBackend() });
// Default cloud model is gemini-3.5-flash-lite (free tier, Gemini Developer API).
const model = getGenerativeModel(ai, { mode: InferenceMode.PREFER_ON_DEVICE });

// ---------- i18n ----------
const I18N = {
  ar: {
    docTitle: "وراسيگا — Warasiga | فهم الوراق بالدارجة",
    langBtn: "English",
    tagline: "صوّر الورقة… وخليها تتفسر ليك بالدارجة",
    step1: "1️⃣ دخل الورقة",
    tabPhoto: "📷 تصويرة",
    tabText: "⌨️ نص",
    dzTitle: "كليكي هنا باش تختار تصويرة",
    dzTitle2: "ديال تيكي، ليستة د الأثمنة، ولا أي ورقة",
    dzHint: "JPEG ولا PNG — مزيان يكون الضو صافي والحرف واضح",
    clearImg: "✕ حيد التصويرة",
    textPh: "لسّق هنا النص ديال الورقة… مثلاً: شكة، فاتورة، ليستة أثمنة، ورقة ديال الخدمة…",
    step2: "2️⃣ فسّرها ليا",
    analyze: "✨ فسّر ليا بالدارجة",
    hint: "دخل تصويرة ولا نص باش يتفعّل الزر",
    consent: "بضغطك على الزر: إلا كان محرك الجهاز جاهز كتتفسر الورقة فجهازك، وإلا كتمشي لـ Google. إلا كانت الورقة حساسة وما بغيتيهاش تمشي، ما تبعثهاش.",
    step3: "3️⃣ الفهم",
    howTitle: "كيفاش كيخدم؟",
    how1a: "فالمتصفح ديالك:",
    how1b: "إلا كان محرك الجهاز متوفر (Chrome جديد)، التلخيص كيدار مباشرة فجهازك (Gemini Nano / Prompt API) — بلا ما تمشي التصويرة لشي سيرفر.",
    how2a: "ولا فالسحابة:",
    how2b: "إلا ما كانش متوفر، كيخدم بـ Gemini عبر Firebase AI Logic.",
    how3: "وراسيگا بلا قاعدة بيانات ديال الوراق وبلا حسابات: ما كنخزنو شي ورقة ولا نص عندنا. غير تفضيل اللغة كيتسجل فالمتصفح ديالك بوحدك. فحالة السحابة، الورقة كتعالج عند Google (Gemini) على حساب شروط الخدمة ديالهم؛ فحالة الجهاز، ما كتخرج من جهازك.",
    how4: "قبل ما تصوّر ولا تلسّق ورقة حساسة: إلا كان محرك الجهاز ماشي متوفر، ولا مازال كيتحمّل (أول استعمال)، الورقة كتمشي للسحابة ديال Google. الشارة اللي فوق كتبين ليك الحالة دابا، قبل ما تبعث والو؛ والسطر اللي تحت كل نتيجة كيأكد فين تفسرات فعلاً.",
    how5: "النصائح مولدة بالذكاء الاصطناعي وماشي نصيحة قانونية ولا طبية رسمية: تأكد من الورقة الأصلية قبل أي قرار مهم.",
    howFoot: "مشروع مفتوح المصدر مبني بـ Firebase AI Logic (Hybrid) لمسابقة #BuildHybridAI 2026.",
    badgeOn: "⚡ المحرك د الجهاز متوفر (Gemini Nano)",
    badgeCloud: "☁️ المحرك د الجهاز ماشي متوفر هنا — غنخدمو بالسحابة (Gemini عبر Firebase)",
    badgeCheck: "⏳ كيتشيك المحرك…",
    errType: "المرجو تصويرة JPEG ولا PNG برك.",
    stPrep: "كيتحضّر المحرك… (أول مرة يمكن دوّز دقايق إلا كان كيحمّل النموذج د الجهاز)",
    stDl: (p) => `كيحمّل نموذج الجهاز… ${p}%`,
    stWork: "كنفسّر ليك الورقة… ⏳",
    engOn: (dt) => `⚡ تفسرات مباشرة فالمتصفح ديالك (on-device) — فـ ${dt} ثانية`,
    engCloud: (dt) => `☁️ تفسرات فالسحابة عبر Firebase AI Logic — فـ ${dt} ثانية`,
    engDone: (dt) => `✅ سالينا — فـ ${dt} ثانية`,
    errAppCheck: "مشكل فالحماية (App Check). عاود المحاولة ولا بدّل المتصفح.",
    errQuota: "الخدمة مشحونة دابا (quota). عاود من بعد شوية.",
    errGeneric: (m) => "وقع مشكل: " + m,
  },
  en: {
    docTitle: "Warasiga — your papers explained in plain words",
    langBtn: "الدارجة",
    tagline: "Snap a paper… and get it explained in plain words",
    step1: "1️⃣ Add the paper",
    tabPhoto: "📷 Photo",
    tabText: "⌨️ Text",
    dzTitle: "Click here to choose a photo",
    dzTitle2: "of a receipt, price list, or any paper",
    dzHint: "JPEG or PNG — good light and clear print works best",
    clearImg: "✕ Remove photo",
    textPh: "Paste the paper's text here… e.g. a cheque, invoice, price list, or work document…",
    step2: "2️⃣ Explain it",
    analyze: "✨ Explain it to me",
    hint: "Add a photo or some text to enable the button",
    consent: "By pressing the button: if the on-device engine is ready, the paper is explained on your device; otherwise it is sent to Google. If the paper is sensitive and you do not want that, do not send it.",
    step3: "3️⃣ The explanation",
    howTitle: "How does it work?",
    how1a: "In your browser:",
    how1b: "when the on-device engine is available (recent Chrome), the explanation runs directly on your device (Gemini Nano / Prompt API) — the photo never leaves for a server.",
    how2a: "Or in the cloud:",
    how2b: "when on-device is unavailable, it runs on Gemini via Firebase AI Logic.",
    how3: "Warasiga has no document database and no accounts: we never store your papers or text on our side. Only your language preference is saved in your own browser. In cloud mode, the paper is processed by Google (Gemini) under their terms of service; in on-device mode, it never leaves your device.",
    how4: "Before you snap or paste a sensitive paper: if the on-device engine is unavailable, or still downloading on first use, the paper goes to Google\u2019s cloud. The badge above shows the current state before you send anything; the line under each result then confirms where it was actually explained.",
    how5: "The tips are AI-generated, not official legal or medical advice: check the original paper before any important decision.",
    howFoot: "Open-source project built with Firebase AI Logic (Hybrid) for the #BuildHybridAI 2026 contest.",
    badgeOn: "⚡ On-device engine available (Gemini Nano)",
    badgeCloud: "☁️ On-device engine unavailable here — using the cloud (Gemini via Firebase)",
    badgeCheck: "⏳ Checking engine…",
    errType: "Please use a JPEG or PNG photo.",
    stPrep: "Preparing the engine… (first use may take a few minutes while the on-device model downloads)",
    stDl: (p) => `Downloading the on-device model… ${p}%`,
    stWork: "Explaining your paper… ⏳",
    engOn: (dt) => `⚡ Explained right in your browser (on-device) — in ${dt}s`,
    engCloud: (dt) => `☁️ Explained in the cloud via Firebase AI Logic — in ${dt}s`,
    engDone: (dt) => `✅ Done — in ${dt}s`,
    errAppCheck: "Protection check failed (App Check). Try again or switch browser.",
    errQuota: "The service is busy right now (quota). Try again in a moment.",
    errGeneric: (m) => "Something went wrong: " + m,
  },
};

let lang = localStorage.getItem("warasiga-lang") === "en" ? "en" : "ar";
const T = (k) => I18N[lang][k];

// ---------- UI wiring ----------
const $ = (id) => document.getElementById(id);
const fileInput = $("fileInput"), preview = $("preview"), previewWrap = $("previewWrap");
const textInput = $("textInput"), analyzeBtn = $("analyzeBtn"), status_ = $("status");
const engineBadge = $("engineBadge"), resultCard = $("resultCard"), result = $("result");
const usedEngine = $("usedEngine"), analyzeHint = $("analyzeHint");

let currentFile = null;
let mode = "photo"; // or "text"
let engineAvail = null; // null = checking

function renderBadge() {
  if (engineAvail === null) {
    engineBadge.textContent = T("badgeCheck");
    engineBadge.className = "badge badge-muted";
    return;
  }
  engineBadge.textContent = engineAvail ? T("badgeOn") : T("badgeCloud");
  engineBadge.className = "badge " + (engineAvail ? "badge-on" : "badge-cloud");
}

function applyLang() {
  document.documentElement.lang = lang === "ar" ? "ar" : "en";
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = T("docTitle");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (typeof I18N[lang][k] === "string") el.textContent = I18N[lang][k];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const k = el.getAttribute("data-i18n-ph");
    if (typeof I18N[lang][k] === "string") el.placeholder = I18N[lang][k];
  });
  $("langToggle").textContent = T("langBtn");
  renderBadge();
  refreshAnalyzeState();
}

$("langToggle").addEventListener("click", () => {
  lang = lang === "ar" ? "en" : "ar";
  localStorage.setItem("warasiga-lang", lang);
  applyLang();
});

// On-device availability badge (Chrome desktop 139+ with Prompt API).
(async function checkOnDevice() {
  let ok = false;
  try {
    if ("LanguageModel" in self) {
      const av = await LanguageModel.availability();
      ok = av === "available" || av === "readily" || av === "readily-available";
    }
  } catch (_) { ok = false; }
  engineAvail = ok;
  renderBadge();
})();

function setStatus(msg, kind = "") {
  status_.textContent = msg;
  status_.className = "status " + kind;
}

function refreshAnalyzeState() {
  const hasImage = mode === "photo" && !!currentFile;
  const hasText = mode === "text" && textInput.value.trim().length > 3;
  analyzeBtn.disabled = !(hasImage || hasText);
  analyzeHint.textContent = analyzeBtn.disabled ? T("hint") : "";
}

// Tabs
$("tabPhoto").addEventListener("click", () => {
  mode = "photo";
  $("tabPhoto").classList.add("active"); $("tabText").classList.remove("active");
  $("panePhoto").classList.remove("hidden"); $("paneText").classList.add("hidden");
  refreshAnalyzeState();
});
$("tabText").addEventListener("click", () => {
  mode = "text";
  $("tabText").classList.add("active"); $("tabPhoto").classList.remove("active");
  $("paneText").classList.remove("hidden"); $("panePhoto").classList.add("hidden");
  refreshAnalyzeState();
});

fileInput.addEventListener("change", () => {
  const f = fileInput.files && fileInput.files[0];
  if (!f) return;
  if (!["image/jpeg", "image/png"].includes(f.type)) {
    setStatus(T("errType"), "err");
    return;
  }
  currentFile = f;
  preview.src = URL.createObjectURL(f);
  previewWrap.classList.remove("hidden");
  setStatus("");
  refreshAnalyzeState();
});

$("clearImg").addEventListener("click", () => {
  currentFile = null; fileInput.value = "";
  previewWrap.classList.add("hidden");
  refreshAnalyzeState();
});

textInput.addEventListener("input", refreshAnalyzeState);

async function fileToInlineData(file) {
  const data = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  return { type: "inlineData", inlineData: { data, mimeType: file.type } };
}

const PROMPT_AR = [
  "You are Warasiga, an assistant for Moroccan users who do not read formal documents easily.",
  "Read this document (receipt, price list, bill, or paper) and explain it in SIMPLE MOROCCAN DARIJA (Arabic script, everyday spoken words, short sentences).",
  "Structure your answer exactly like this:",
  "1) «شنو هاد الورقة؟» — one sentence saying what this paper is.",
  "2) «شنو فيها؟» — a list of the items/services and their prices, one per line, like: «خبز: 2 درهم».",
  "Never say how many items there are — do not write a count like «أربعة سلع» or «ستة أصناف»; just list them, one per line.",
  "3) «المجموع» — the total if there is one, with the currency.",
  "4) «شنو خاصك دير دابا؟» — one or two practical tips (for example: check the change, keep the receipt, deadline to pay).",
  "If some text is unreadable, say «ما بانش مزيان» for that part instead of guessing numbers.",
  "If a price or total is not perfectly sharp and certain in the image, write «ما بانش مزيان» in its place — never estimate or reconstruct a blurred number.",
  "Only when every line is a clear item line total with no quantities, discounts, taxes or adjustments: add up the lines, and if the printed total differs, show the printed total and add «تنبيه: المجموع المكتوب ما كيطابقش مجموع الأثمنة المقروءة (خاصو يكون X درهم) — تأكد» with X your computed sum.",
  "If quantities, discounts, taxes or unclear lines are present, do not compute: show the printed total as printed, without a mismatch warning.",
  "Never invent prices or totals. Keep it short and friendly."
].join("\n");

const PROMPT_EN = [
  "You are Warasiga, an assistant for users who do not read formal documents easily.",
  "Read this document (receipt, price list, bill, or paper) and explain it in SIMPLE EVERYDAY ENGLISH (short sentences).",
  "Structure your answer exactly like this:",
  "1) «What is this paper?» — one sentence saying what this paper is.",
  "2) «What is in it?» — a list of the items/services and their prices, one per line, like: «Bread: 2 MAD».",
  "Never state how many items there are; just list them, one per line, with no count words.",
  "3) «Total» — the total if there is one, with the currency.",
  "4) «What should you do now?» — one or two practical tips (for example: check the change, keep the receipt, deadline to pay).",
  "If some text is unreadable, say «not clearly readable» for that part instead of guessing numbers.",
  "If a price or total is not perfectly sharp and certain in the image, write «not clearly readable» in its place — never estimate or reconstruct a blurred number.",
  "Only when every line is a clear item line total with no quantities, discounts, taxes or adjustments: add up the lines, and if the printed total differs, show the printed total and add «warning: the printed total does not match the sum of the readable items (should be X) — double-check» with X your computed sum.",
  "If quantities, discounts, taxes or unclear lines are present, do not compute: show the printed total as printed, without a mismatch warning.",
  "Never invent prices or totals. Keep it short and friendly."
].join("\n");

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function renderMarkdownLite(md) {
  let html = escapeHtml(md);
  html = html
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^[-*] (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)(?![\s\S]*?<li>)/g, "<ul>$1</ul>")
    .replace(/\n{2,}/g, "<br><br>")
    .replace(/\n/g, "<br>");
  return html;
}

analyzeBtn.addEventListener("click", async () => {
  analyzeBtn.disabled = true;
  resultCard.classList.add("hidden");
  try {
    // Must be called on a user gesture: starts/ensures on-device model download.
    setStatus(T("stPrep"));
    try {
      // initializeDeviceModel is async: PREFER_ON_DEVICE lets early requests use
      // the cloud while a local model downloads; the per-result engine line
      // discloses which path actually answered.
      const p = model.initializeDeviceModel((v) =>
        setStatus(T("stDl")(Math.round(v * 10000) / 100)));
      if (p && typeof p.catch === "function") {
        p.catch((e) => console.warn("on-device init rejected (cloud fallback continues):", e));
      }
    } catch (e) {
      console.warn("on-device init skipped:", e);
    }

    const PROMPT = lang === "en" ? PROMPT_EN : PROMPT_AR;
    const parts = [];
    if (mode === "photo" && currentFile) {
      parts.push(await fileToInlineData(currentFile));
      parts.push({ type: "text", text: PROMPT });
    } else {
      parts.push({ type: "text", text: PROMPT + "\n\nHere is the document text:\n«" + textInput.value.trim() + "»" });
    }

    setStatus(T("stWork"));
    const t0 = performance.now();
    const res = await model.generateContent({ contents: [{ role: "user", parts }] });
    const dt = ((performance.now() - t0) / 1000).toFixed(1);
    const text = res.response.text();

    // The SDK reports which inference source served the request.
    const src = res?.response?.inferenceSource ?? res?.inferenceSource ?? null;
    usedEngine.textContent =
      (src && /on.?device/i.test(String(src)))
        ? T("engOn")(dt)
        : (src && /cloud/i.test(String(src)))
        ? T("engCloud")(dt)
        : T("engDone")(dt);

    result.innerHTML = renderMarkdownLite(text);
    resultCard.classList.remove("hidden");
    resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
    setStatus("");
  } catch (e) {
    console.error(e);
    const msg = String(e && e.message || e);
    if (/app.?check/i.test(msg)) {
      setStatus(T("errAppCheck"), "err");
    } else if (/429|quota|rate/i.test(msg)) {
      setStatus(T("errQuota"), "err");
    } else {
      setStatus(T("errGeneric")(msg.slice(0, 160)), "err");
    }
  } finally {
    analyzeBtn.disabled = false;
    refreshAnalyzeState();
  }
});

applyLang();
