import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { getPage } from "@/lib/shop";
import { truncate } from "@/lib/utils";

/** Rota 100% estática; página inexistente responde 404 de verdade (veja produtos/[handle]). */
export const ensureStatic = "navigation";
export const instant = false; // veja o comentário em produtos/[handle]/page.tsx

export function generateStaticParams() {
  return site.pages.map((page) => ({ handle: page.handle }));
}

export async function generateMetadata({ params }: PageProps<"/paginas/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) return { title: "Página não encontrada", robots: { index: false, follow: false } };
  return pageMetadata({
    title: page.title,
    description: truncate(page.summary || `${page.title} da ${site.name}.`, 158),
    path: `/paginas/${page.handle}`,
  });
}

export default async function InstitutionalPage({ params }: PageProps<"/paginas/[handle]">) {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) notFound();

  return (
    <article className="container-page max-w-3xl py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { name: "Início", href: "/" },
          { name: page.title, href: `/paginas/${page.handle}` },
        ]}
      />
      <h1 className="mb-8 mt-6 text-4xl font-extrabold uppercase leading-[1] tracking-[-0.04em] sm:text-5xl">
        {page.title}
      </h1>
      <div className="rich-text text-[15px]" dangerouslySetInnerHTML={{ __html: page.body }} />
    </article>
  );
}
