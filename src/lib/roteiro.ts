import type { Formato, Tema } from "@/data/temas";

// Gera o mini-roteiro de 60s a partir de um template por formato,
// preenchendo com o tema e o gancho. Sempre fecha com controle (nunca
// cura) e chamada para o perfil. Sem travessao.

const CHAMADA =
  "No Geração Serena a gente fala do corpo e da mente juntos. Me segue.";

export interface BlocoRoteiro {
  tempo: string;
  texto: string;
}

export function gerarRoteiro(tema: Tema): BlocoRoteiro[] {
  const { gancho, tema: titulo, formato } = tema;

  const templates: Record<Formato, BlocoRoteiro[]> = {
    Explicação: [
      { tempo: "0 a 10s", texto: `Abre com o gancho: "${gancho}"` },
      {
        tempo: "10 a 40s",
        texto: `Explique a ideia central de "${titulo}" em uma frase clara e dê um exemplo do dia a dia.`,
      },
      {
        tempo: "40 a 55s",
        texto:
          "Mostre o que a pessoa pode fazer com isso, sempre como forma de controle e manejo, nunca como cura.",
      },
      { tempo: "55 a 60s", texto: CHAMADA },
    ],
    Técnica: [
      {
        tempo: "0 a 8s",
        texto: `Gancho e promessa do passo a passo: "${gancho}"`,
      },
      {
        tempo: "8 a 45s",
        texto: `Ensine os passos de "${titulo}" numerados e bem simples, um de cada vez.`,
      },
      {
        tempo: "45 a 60s",
        texto:
          "Diga quando usar e lembre que é uma ferramenta de controle, não mágica. Feche com a chamada para o perfil.",
      },
    ],
    "Mito vs Verdade": [
      { tempo: "0 a 8s", texto: `Enuncie o mito ligado a "${titulo}".` },
      {
        tempo: "8 a 20s",
        texto: `Reconheça por que parece verdade. Use o gancho: "${gancho}"`,
      },
      {
        tempo: "20 a 50s",
        texto:
          "Apresente o que a ciência diz, sem citar estatística sem fonte verificada.",
      },
      {
        tempo: "50 a 60s",
        texto: `Traga a correção com tom de controle e feche: ${CHAMADA}`,
      },
    ],
    "Pergunta de paciente": [
      { tempo: "0 a 8s", texto: `Faça a pergunta exata: "${gancho}"` },
      {
        tempo: "8 a 45s",
        texto: `Responda de forma direta e acolhedora sobre "${titulo}", falando em controle e entendimento, nunca em cura.`,
      },
      {
        tempo: "45 a 60s",
        texto: `Diga o que isso muda na prática e feche: ${CHAMADA}`,
      },
    ],
    Gancho: [
      { tempo: "0 a 5s", texto: `Provocação curta: "${gancho}"` },
      {
        tempo: "5 a 50s",
        texto: `Entregue o que prometeu sobre "${titulo}", de forma firme e humana.`,
      },
      { tempo: "50 a 60s", texto: `Fechamento com controle e chamada: ${CHAMADA}` },
    ],
  };

  return templates[formato];
}

// Versao em texto puro do roteiro, para o botao Copiar tema.
export function roteiroTexto(tema: Tema): string {
  return gerarRoteiro(tema)
    .map((b) => `(${b.tempo}) ${b.texto}`)
    .join("\n");
}

export function blocoCopiavel(tema: Tema): string {
  return [
    `TEMA: ${tema.tema}`,
    `GANCHO: ${tema.gancho}`,
    `PILAR: ${tema.pilar}`,
    `FORMATO: ${tema.formato}`,
    `APRESENTADOR: ${tema.apresentador}`,
    "",
    "MINI-ROTEIRO DE 60s:",
    roteiroTexto(tema),
    "",
    "Geração Serena 🌿 | Roleta de Temas",
  ].join("\n");
}
