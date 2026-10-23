import Link from "next/link";
import { cacheLife } from "next/cache";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { InstagramIcon, TikTokIcon, WhatsAppIcon, YoutubeIcon } from "@/components/ui/icons";
import { site } from "@/config/site";
import { getCollections, getSpecialLinks } from "@/lib/shop";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const columnTitle = "mb-4 text-[11px] font-extrabold uppercase tracking-[0.18em]";
const linkClass = "text-[13px] text-ink/80 underline-offset-4 transition-colors hover:text-ink hover:underline";

export async function Footer() {
  const [allCollections, { newHref, bestHref }] = await Promise.all([getCollections(), getSpecialLinks()]);
  const collections = allCollections
    .filter((collection) => !site.collections.hidden.includes(collection.handle))
    .slice(0, 6);

  const social = [
    { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: site.social.tiktok, label: "TikTok", Icon: TikTokIcon },
    { href: site.social.youtube, label: "YouTube", Icon: YoutubeIcon },
  ].filter((item) => item.href);

  return (
    <footer className="container-page pb-6 pt-8">
      <div className="overflow-hidden rounded-[1.75rem] bg-lime">
        <div className="px-6 pb-10 pt-10 sm:px-12 sm:pt-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em]">Newsletter</p>
              <h2 className="mt-2 text-2xl font-extrabold uppercase leading-tight tracking-[-0.02em] sm:text-3xl">
                Entre para o time
              </h2>
              <p className="mt-2 max-w-sm text-sm text-ink/80">
                Ganhe <strong className="font-extrabold">{site.newsletter.discountLabel}</strong> na primeira compra e
                receba lançamentos antes de todo mundo.
              </p>
            </div>
            <NewsletterForm />
          </div>

          <hr className="my-10 border-ink/80" />

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <Logo />
              <p className="mt-4 max-w-[16rem] text-[13px] leading-relaxed text-ink/80">{site.tagline}.</p>
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

            <div>
              <h3 className={columnTitle}>Fale com a gente</h3>
              <ul className="space-y-2.5 text-[13px] text-ink/80">
                <li>
                  <a href={`mailto:${site.contact.email}`} className={linkClass}>
                    {site.contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${site.contact.whatsapp}`}
                    className={`${linkClass} inline-flex items-center gap-2`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="size-4" /> WhatsApp
                  </a>
                </li>
                <li>{site.contact.hours}</li>
              </ul>
              {social.length > 0 && (
                <ul className="mt-5 flex gap-2" aria-label="Redes sociais">
                  {social.map(({ href, label, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="grid size-10 place-items-center rounded-full border border-ink transition-colors hover:bg-ink hover:text-lime"
                      >
                        <Icon className="size-[18px]" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="bg-ink px-6 py-5 text-[11px] leading-relaxed text-white/75 sm:px-12">
          <p>
            © <CopyrightYear /> {site.legalName} · CNPJ {site.cnpj} · Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
