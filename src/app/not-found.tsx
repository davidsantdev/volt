import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-content-center justify-items-center gap-6 py-20 text-center">
      <p className="text-[clamp(6rem,24vw,14rem)] font-extrabold leading-none tracking-[-0.08em] text-volt">404</p>
      <div>
        <h1 className="text-3xl font-extrabold uppercase tracking-[-0.03em] sm:text-4xl">Essa página fugiu do treino</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-soft">
          O endereço pode ter mudado ou o produto saiu de linha. Volte para a loja e encontre a peça certa.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/produtos" size="lg">
          Ver produtos
        </ButtonLink>
        <ButtonLink href="/" variant="outline" size="lg">
          Página inicial
        </ButtonLink>
      </div>
    </div>
  );
}
