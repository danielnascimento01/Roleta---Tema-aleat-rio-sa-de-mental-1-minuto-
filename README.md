# Roleta Serena 🌿

Máquina de ideias de conteúdo de saúde mental da marca **Geração Serena**.
O app sorteia, por uma roleta giratória, um tema para os apresentadores
gravarem um Reels curto, e já abre um cartão com gancho, pilar, formato,
apresentador sugerido, mini-roteiro de 60 segundos e um cronômetro
regressivo integrado.

## Stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** para o visual da marca
- **Framer Motion** para a roleta e as transições
- Sem backend e sem banco. O banco de temas vive em `src/data/temas.ts` e o
  histórico de sorteios usa `localStorage`.

## Como rodar localmente

```bash
pnpm install
pnpm dev
```

Acesse http://localhost:3000.

Para conferir o build de produção:

```bash
pnpm build
pnpm start
```

## Como publicar mudanças

O deploy é na Vercel pela CLI:

```bash
vercel          # preview
vercel --prod   # produção
```

## Funcionalidades

- Roleta com um gomo por pilar (Corpo, Mente, Cérebro, Energia, Vida,
  Engajamento). Ao parar num pilar, sorteia um tema aleatório daquele pilar.
- Botão **Sortear tema direto** para sortear de todo o banco de uma vez.
- Filtros por **apresentador**, **pilar** (multiseleção, liga e desliga
  gomos) e **formato**.
- Cartão do tema com gancho, etiquetas, apresentador e mini-roteiro de 60s
  gerado por template de formato.
- Cronômetro de 60s integrado, com iniciar, pausar, reiniciar, seletor de
  duração (30s, 60s, 90s) e aviso visual e sonoro nos últimos 10 segundos.
- Histórico anti-repetição em `localStorage` (últimos 30 temas), com gaveta
  de histórico e botão de limpar.
- Som discreto e desligável (clique do giro e sinal de fim).

## Identidade visual

- Azul profundo `#0d2137`, dourado `#c49e5a` e apoios sóbrios por pilar.
- Títulos em **Cormorant Garamond**, corpo em **DM Sans** (via `next/font`).

## Como expandir o banco de temas

Edite **`src/data/temas.ts`** e adicione novos objetos ao array `TEMAS`,
no mesmo formato:

```ts
{
  id: 205,                       // próximo id sequencial
  tema: "Título curto do tema",  // aparece grande no cartão
  gancho: "Frase de abertura falada, sem travessão",
  pilar: "Corpo",                // Corpo | Mente | Cérebro | Energia | Vida | Engajamento
  apresentador: "Carlos",        // Carlos | Henrique | Marina | Qualquer
  formato: "Explicação",         // Explicação | Técnica | Mito vs Verdade | Pergunta de paciente | Gancho
}
```

### Regras editoriais (obrigatórias em todo texto)

1. Nunca usar travessão (o caractere em dash). Use vírgula, dois pontos,
   parênteses ou ponto.
2. Nunca prometer cura. Fale em controle, manejo e entendimento.
3. Nunca citar estatística sem fonte verificada.
4. Nunca usar o título "Psiquiatra" para o Dr. Henrique.
5. Sem clichês de coaching e sem linguagem de biohacking.
6. Tom direto, firme, humano e científico. Acolhimento sem infantilizar.

O mini-roteiro de cada formato é gerado em `src/lib/roteiro.ts`. Para mudar
a estrutura dos 60 segundos, edite os templates por formato nesse arquivo.
