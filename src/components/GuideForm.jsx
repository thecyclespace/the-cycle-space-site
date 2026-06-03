import { useEffect, useState } from "react";
import { Icon, Button } from "./ui";
import { useI18n } from "../lib/i18n";
import siteSettings from "../content/settings/site.json";

const GUIDE_PDF = siteSettings.guidePdf;
const GUIDE_FILENAME = siteSettings.guideFilename;
const STORAGE_KEY = "tcs_guide_email";

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

// NOTE — Capture des emails (lead capture) :
// L'ancienne version envoyait l'email à Netlify Forms. Netlify a été retiré du
// projet : l'email est validé et déclenche le téléchargement du PDF, mais il
// n'est plus envoyé à un service externe. Le site étant hébergé sur GitHub Pages
// (100 % statique, sans serveur), réactiver la collecte des emails passe par un
// service externe gratuit (Formspree, Getform…) à brancher ici.
// Voir CMS_MIGRATION_AUDIT.md > "Follow-ups".

export default function GuideForm() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setEmail(saved);
        setStatus("done");
      }
    } catch {}
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!isValidEmail(value)) {
      setStatus("invalid");
      return;
    }
    setStatus("submitting");
    try { localStorage.setItem(STORAGE_KEY, value); } catch {}
    triggerGuideDownload();
    setTimeout(() => setStatus("done"), 250);
  };

  if (status === "done") {
    return (
      <div className="mt-10 max-w-xl rounded-[2rem] border border-[#9E4F49]/30 bg-[#FBF7EF] p-6 text-[#241915]">
        <div className="flex items-start gap-4">
          <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#9E4F49]/15 text-[#6F3432]">
            <Icon name="check" size={20} />
          </span>
          <div className="flex-1">
            <p className="font-serif text-2xl leading-tight">{t.guideThanksTitle}</p>
            <p className="mt-2 text-sm leading-6 text-[#5d5049]">{t.guideThanksText}</p>
            <button
              type="button"
              onClick={triggerGuideDownload}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#6F3432] hover:text-[#9E4F49]"
            >
              <Icon name="download" size={16} /> {t.guideDownloadAgain}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-[2rem] bg-[#FBF7EF] p-2 sm:flex-row sm:rounded-full"
        noValidate
      >
        <input
          className="min-w-0 flex-1 bg-transparent px-5 py-4 text-[#241915] outline-none placeholder:text-[#8a7d75]"
          placeholder={t.emailPlaceholder}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "invalid") setStatus("idle");
          }}
          aria-label="Email"
          aria-invalid={status === "invalid"}
          required
        />
        <Button type="submit" className="bg-[#9E4F49] px-6 py-4 text-[#FBF7EF] hover:bg-[#6F3432]">
          <Icon name="download" size={18} /> {t.download}
        </Button>
      </form>
      {status === "invalid" && (
        <p className="mt-3 px-2 text-sm text-[#C46B63]" role="alert">
          {t.guideInvalidEmail}
        </p>
      )}
      <p className="mt-3 px-2 text-xs text-[#DCCDB8]">{t.guideConsent}</p>
    </div>
  );
}
