type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

/** Dados estruturados (schema.org). O `<` é escapado para o JSON nunca fechar a tag <script>. */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
