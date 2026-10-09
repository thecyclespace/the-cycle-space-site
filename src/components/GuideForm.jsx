import { useState } from "react";
import { Icon, Button } from "./ui";
import { useI18n } from "../lib/i18n";
import siteSettings from "../content/settings/site.json";

const GUIDE_PDF = siteSettings.guidePdf;
const GUIDE_FILENAME = siteSettings.guideFilename;

function triggerGuideDownload() {
  const a = document.createElement("a");
  a.href = `${import.meta.env.BASE_URL}${GUIDE_PDF}`;
  a.download = GUIDE_FILENAME;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Direct download, no email asked.
// The previous version collected an email and promised "occasional updates" but never
// sent the address anywhere (the site is static, no mailing-list service is configured),
// so it made a promise the site could not keep. Until a real mailing-list provider is
// chosen and configured, the guide is a plain download and nothing is stored.
export default function GuideForm() {
  const { t } = useI18n();
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    triggerGuideDownload();
    setDownloaded(true);
  };

  return (
    <div className="mt-8 max-w-xl md:mt-10">
      <Button
        onClick={handleDownload}
        className="min-h-[48px] w-full bg-[#7C3C3C] px-7 py-4 text-[#FBF7EF] hover:bg-[#5C2B2B] sm:w-auto"
      >
        <Icon name="download" size={18} /> {downloaded ? t.guideDownloadAgain : t.download}
      </Button>
      <p className="mt-4 text-sm leading-6 text-[#DCCDB8]" role="status" aria-live="polite">
        {downloaded ? t.guideThanksText : t.guideConsent}
      </p>
    </div>
  );
}
