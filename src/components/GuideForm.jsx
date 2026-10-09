import { useId, useState } from "react";
import { Icon, Button } from "./ui";
import { useI18n } from "../lib/i18n";
import siteSettings from "../content/settings/site.json";

const GUIDE_PDF = siteSettings.guidePdf;
const GUIDE_FILENAME = siteSettings.guideFilename;
// Where guide sign-ups are sent (Elsa's inbox). Editable in the CMS (Réglages > "Email qui reçoit les inscriptions").
const LEAD_EMAIL = siteSettings.guideLeadEmail;

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function triggerGuideDownload() {
  const a = document.createElement("a");
  a.href = `${import.meta.env.BASE_URL}${GUIDE_PDF}`;
  a.download = GUIDE_FILENAME;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Sends the sign-up by email to Elsa through FormSubmit (https://formsubmit.co):
// a free relay for static sites, no account needed. First use: FormSubmit emails
// an activation link to LEAD_EMAIL, which must be confirmed once.
// Only the email address, the language and the consent are sent. Never any health data.
async function sendLead({ email, lang }) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(LEAD_EMAIL)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: "The Cycle Space — new guide download",
      _template: "table",
      _captcha: "false",
      email,
      language: lang,
      consent: "Agreed to receive the guide and occasional emails from The Cycle Space",
      source: "Know Your Flow guide",
    }),
  });
  if (!res.ok) throw new Error(`lead request failed: ${res.status}`);
  const data = await res.json().catch(() => ({}));
  if (data.success === "false" || data.success === false) throw new Error("lead rejected");
}

// status: idle | invalid | consent | sending | sent | failed | direct
export default function GuideForm() {
  const { t, lang } = useI18n();
  const uid = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) return setStatus("invalid");
    if (!consent) return setStatus("consent");
    setStatus("sending");
    triggerGuideDownload(); // the download never depends on the email service
    if (honey) return setStatus("sent"); // bot: pretend success, send nothing
    try {
      await sendLead({ email: email.trim(), lang });
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const handleDirect = () => {
    triggerGuideDownload();
    setStatus("direct");
  };

  if (status === "sent" || status === "failed" || status === "direct") {
    const text = status === "sent" ? t.guideSentText : status === "failed" ? t.guideFailedText : t.guideThanksText;
    return (
      <div className="mt-8 max-w-xl rounded-[1.5rem] border border-[#7C3C3C]/30 bg-[#FBF7EF] p-5 text-[#362E28] md:mt-10 md:p-6" role="status" aria-live="polite">
        <div className="flex items-start gap-4">
          <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C3C3C]/15 text-[#5C2B2B]">
            <Icon name="check" size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-2xl leading-tight">{t.guideThanksTitle}</p>
            <p className="mt-2 text-base leading-6 text-[#5d5049]">{text}</p>
            <button
              type="button"
              onClick={triggerGuideDownload}
              className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[#5C2B2B] hover:text-[#7C3C3C]"
            >
              <Icon name="download" size={16} /> {t.guideDownloadAgain}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sending = status === "sending";
  const emailError = status === "invalid" ? t.guideInvalidEmail : null;
  const consentError = status === "consent" ? t.guideConsentRequired : null;

  return (
    <div className="mt-8 max-w-xl md:mt-10">
      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
        <div>
          <label htmlFor={`${uid}-email`} className="block text-sm font-medium text-[#E7D8C8]">
            {t.guideEmailLabel}
          </label>
          <input
            id={`${uid}-email`}
            className="mt-2 w-full rounded-2xl border border-[#FBF7EF]/20 bg-[#FBF7EF] px-4 py-3 text-base text-[#362E28] outline-none placeholder:text-[#8a7d75] focus:ring-2 focus:ring-[#D4887F]"
            placeholder={t.emailPlaceholder}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "invalid") setStatus("idle");
            }}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? `${uid}-email-error` : undefined}
            required
          />
          {emailError && (
            <p id={`${uid}-email-error`} className="mt-2 text-sm text-[#F0B3AC]" role="alert">
              {emailError}
            </p>
          )}
        </div>

        {/* Honeypot: hidden from people, filled by bots. */}
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label>
            Website
            <input type="text" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} />
          </label>
        </div>

        <div>
          <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm leading-6 text-[#E7D8C8]">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (status === "consent") setStatus("idle");
              }}
              aria-describedby={consentError ? `${uid}-consent-error` : undefined}
              className="mt-1 h-5 w-5 shrink-0 accent-[#7C3C3C]"
            />
            <span>{t.guideConsent}</span>
          </label>
          {consentError && (
            <p id={`${uid}-consent-error`} className="mt-1 text-sm text-[#F0B3AC]" role="alert">
              {consentError}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-5">
          <Button
            type="submit"
            className="min-h-[48px] w-full bg-[#7C3C3C] px-7 py-4 text-[#FBF7EF] hover:bg-[#5C2B2B] sm:w-auto"
          >
            <Icon name="download" size={18} /> {sending ? t.guideSending : t.download}
          </Button>
          <button
            type="button"
            onClick={handleDirect}
            className="inline-flex min-h-[44px] items-center text-sm text-[#DCCDB8] underline underline-offset-4 hover:text-[#FBF7EF]"
          >
            {t.guideNoEmail}
          </button>
        </div>
      </form>
    </div>
  );
}
