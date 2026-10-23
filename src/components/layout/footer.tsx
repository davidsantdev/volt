import Link from "next/link";
import { cacheLife } from "next/cache";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { InstagramIcon, TikTokIcon, WhatsAppIcon, YoutubeIcon } from "@/components/ui/icons";
import { site } from "@/config/site";
import { hasContactChannel, whatsappHref } from "@/lib/promos";
import { getCollections, getSpecialLinks } from "@/lib/shop";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const columnTitle = "mb-4 text-[11px] font-extrabold uppercase tracking-[0.18em]";
const linkClass = "text-[13px] text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline";

export async function Footer() {
  const [allCollections, { newHref, bestHref }] = await Promise.all([getCollections(), getSpecialLinks()]);
  const collections = allCollections
    .filter((collection) => !site.collections.hidden.includes(collection.handle))
    .slice(0, 12);

  const contactChannel = hasContactChannel();
  const whatsapp = whatsappHref();
  const social = [
    { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: site.social.tiktok, label: "TikTok", Icon: TikTokIcon },
    { href: site.social.youtube, label: "YouTube", Icon: YoutubeIcon },
  ].filter((item) => item.href);

  return (
    <footer className="mt-4">
      <div className="bg-ink text-white">
        <div className="container-page flex flex-col gap-8 py-12 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-volt">Newsletter</p>
            <h2 className="mt-2 font-display text-[2.5rem] font-extrabold uppercase leading-[0.95] sm:text-5xl">
              Entre para o time
            </h2>
            <p className="mt-3 max-w-sm text-sm text-white/75">
              {site.newsletter.discountLabel ? (
                <>
                  Ganhe <strong className="font-extrabold">{site.newsletter.discountLabel}</strong> na primeira compra
                  e receba lançamentos antes de todo mundo.
                </>
              ) : (
                "Receba lançamentos, reposições e ofertas antes de todo mundo."
              )}
            </p>
          </div>
          <NewsletterForm tone="dark" />
        </div>
      </div>

      <div className="container-page py-12 sm:py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-[16rem] text-[13px] leading-relaxed text-ink-soft">{site.tagline}.</p>
          </div>

          <nav aria-label="Loja">
            <h3 className={columnTitle}>Loja</h3>
            <ul className="space-y-2.5">
              <li><Link href="/produtos" className={linkClass}>Todos os produtos</Link></li>
              <li><Link href={newHref} className={linkClass}>Lançamentos</Link></li>
              {bestHref && <li><Link href={bestHref} className={linkClass}>Mais vendidos</Link></li>}
              <li><Link href="/colecoes" className={linkClass}>Todas as coleções</Link></li>
            </ul>
          </nav>

          {collections.length > 0 && (
            <nav aria-label="Categorias">
              <h3 className={columnTitle}>Categorias</h3>
              <ul className="space-y-2.5">
                {collections.map((collection) => (
                  <li key={collection.handle}>
                    <Link href={`/colecoes/${collection.handle}`} className={linkClass}>
                      {collection.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <nav aria-label="Ajuda e institucional">
            <h3 className={columnTitle}>Ajuda</h3>
            <ul className="space-y-2.5">
              {site.pages.map((page) => (
                <li key={page.handle}>
                  <Link href={`/paginas/${page.handle}`} className={linkClass}>
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {(contactChannel || social.length > 0) && (
          <div>
            <h3 className={columnTitle}>Fale com a gente</h3>
            {contactChannel && (
              <ul className="space-y-2.5 text-[13px] text-ink-soft">
                {site.contact.email && (
                  <li>
                    <a href={`mailto:${site.contact.email}`} className={linkClass}>
                      {site.contact.email}
                    </a>
                  </li>
                )}
                {whatsapp && (
                  <li>
                    <a
                      href={whatsapp}
                      className={`${linkClass} inline-flex items-center gap-2`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsAppIcon className="size-4" /> WhatsApp
                    </a>
                  </li>
                )}
                {site.contact.hours && <li>{site.contact.hours}</li>}
              </ul>
            )}
            {social.length > 0 && (
              <ul className="mt-5 flex gap-2" aria-label="Redes sociais">
                {social.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid size-10 place-items-center rounded-full border border-ink transition-colors hover:bg-ink hover:text-volt"
                    >
                      <Icon className="size-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          )}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-1.5 py-5 text-[11px] leading-relaxed text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> {site.legalName || site.name}
            {site.cnpj && ` · CNPJ ${site.cnpj}`} · Todos os direitos reservados.
          </p>
          <p>Pagamento processado no checkout seguro da Shopify.</p>
        </div>
      </div>
    </footer>
  );
}
