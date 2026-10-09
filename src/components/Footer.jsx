import { useI18n } from "../lib/i18n";
import { Icon, BrandLogo } from "./ui";
import siteSettings from "../content/settings/site.json";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-[#FBF7EF] px-5 pb-28 pt-12 md:px-8 md:pb-12">
      <div className="mx-auto max-w-7xl border-t border-[#DCCDB8] pt-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <BrandLogo variant="wordmark" tone="light" height={32} />
            <p className="mt-3 text-sm text-[#6e625b]">{t.footerTagline}</p>
            <p className="mt-1 text-sm text-[#6e625b]">{siteSettings.footerHandle}</p>
          </div>
          <div className="flex gap-3 text-[#5d5049]">
            <a
              href={siteSettings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#DCCDB8] p-3 hover:bg-[#F4EBDD]"
              aria-label="Instagram"
            >
              <Icon name="instagram" size={18} />
            </a>
            <a
              href={`mailto:${siteSettings.contactEmail}`}
              className="rounded-full border border-[#DCCDB8] p-3 hover:bg-[#F4EBDD]"
              aria-label="Email"
            >
              <Icon name="mail" size={18} />
            </a>
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-5 text-[#6e625b]">{t.disclaimer}</p>
        <p className="mt-3 text-xs text-[#6e625b]">© <span suppressHydrationWarning>{new Date().getFullYear()}</span> {siteSettings.siteName}</p>
      </div>
    </footer>
  );
}
