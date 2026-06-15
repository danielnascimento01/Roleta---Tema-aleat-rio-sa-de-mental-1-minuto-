"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Pilar, Tema } from "@/data/temas";
import CartaoTema from "@/components/CartaoTema";
import Cronometro from "@/components/Cronometro";
import Filtros from "@/components/Filtros";
import Historico from "@/components/Historico";
import Roleta from "@/components/Roleta";
import { PILARES } from "@/lib/cores";
import {
  lerHistorico,
  limparHistorico,
  registrarSorteio,
} from "@/lib/historico";
import type { Filtros as FiltrosTipo } from "@/lib/sorteio";
import {
  pilaresComTema,
  sortearDireto,
  sortearPorPilar,
} from "@/lib/sorteio";

const FILTROS_INICIAIS: FiltrosTipo = {
  apresentador: "Todos",
  pilares: [...PILARES],
  formato: "Todos",
};

export default function Home() {
  const [filtros, setFiltros] = useState<FiltrosTipo>(FILTROS_INICIAIS);
  const [tema, setTema] = useState<Tema | null>(null);
  const [girando, setGirando] = useState(false);
  const [gravando, setGravando] = useState(false);
  const [mudo, setMudo] = useState(false);
  const [historico, setHistorico] = useState<number[]>([]);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const resultadoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistorico(lerHistorico());
  }, []);

  // Pilares que estao ligados no filtro E tem ao menos um tema disponivel.
  const pilaresAtivos = useMemo<Pilar[]>(() => {
    const comTema = pilaresComTema(filtros);
    return filtros.pilares.filter((p) => comTema.has(p));
  }, [filtros]);

  function aoSortearTema(novo: Tema | null) {
    if (!novo) return;
    setTema(novo);
    setGravando(false);
    setHistorico(registrarSorteio(novo.id));
    window.setTimeout(() => {
      resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function aoResultadoRoleta(pilar: Pilar) {
    setGirando(false);
    aoSortearTema(sortearPorPilar(pilar, filtros, historico));
  }

  function sortearDiretoHandler() {
    if (girando) return;
    aoSortearTema(sortearDireto(filtros, historico));
  }

  function escolherDoHistorico(t: Tema) {
    setTema(t);
    setGravando(false);
    setHistoricoAberto(false);
    window.setTimeout(() => {
      resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function limpar() {
    limparHistorico();
    setHistorico([]);
  }

  const semPilares = pilaresAtivos.length === 0;

  return (
    <main className="marca-folha relative mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6">
      {/* Cabecalho */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-title text-3xl font-bold tracking-tight text-[#f4f1ea] sm:text-4xl">
            Geração Serena <span aria-hidden="true">🌿</span>
          </h1>
          <p className="mt-0.5 text-sm uppercase tracking-[0.2em] text-serena-dourado">
            Roleta de Temas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMudo((m) => !m)}
            aria-pressed={mudo}
            aria-label={mudo ? "Ativar som" : "Silenciar som"}
            title={mudo ? "Som desligado" : "Som ligado"}
            className="rounded-full border border-[#1d3b58] p-2.5 text-[#cdd8e3] transition hover:bg-[#13314c]"
          >
            {mudo ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" />
                <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" />
                <path d="M16 8a5 5 0 0 1 0 8M18.5 5.5a9 9 0 0 1 0 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => setHistoricoAberto(true)}
            aria-label="Abrir histórico"
            className="rounded-full border border-[#1d3b58] p-2.5 text-[#cdd8e3] transition hover:bg-[#13314c]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.05 11a9 9 0 1 1 .5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 4v4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </header>

      <Filtros filtros={filtros} onMudar={setFiltros} />

      <section className="flex flex-col items-center gap-4">
        <Roleta
          pilaresAtivos={pilaresAtivos}
          girando={girando}
          mudo={mudo}
          onInicio={() => setGirando(true)}
          onResultado={aoResultadoRoleta}
        />
        <button
          type="button"
          onClick={sortearDiretoHandler}
          disabled={girando || semPilares}
          className="rounded-full border border-serena-dourado/60 px-5 py-2.5 text-sm font-medium text-serena-dourado transition hover:bg-serena-dourado/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sortear tema direto
        </button>
        {semPilares && (
          <p className="text-center text-sm text-[#d6a884]">
            Nenhum tema com esses filtros. Ajuste o apresentador, o formato ou
            ligue mais pilares.
          </p>
        )}
      </section>

      <div ref={resultadoRef} className="scroll-mt-4">
        {gravando && tema ? (
          <div className="rounded-2xl border border-serena-dourado/30 bg-[#102a45]/80 p-6 sm:p-8">
            <p className="mb-5 text-center font-title text-2xl text-[#f4f1ea]">
              {tema.tema}
            </p>
            <Cronometro mudo={mudo} onFechar={() => setGravando(false)} />
          </div>
        ) : tema ? (
          <CartaoTema
            tema={tema}
            onGirarDeNovo={() => {
              setTema(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onIniciarGravacao={() => setGravando(true)}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[#1d3b58] bg-[#0f2640]/40 px-6 py-10 text-center">
            <p className="font-title text-2xl text-[#f4f1ea]">
              Gire a roleta e comece a gravar
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#9fb2c5]">
              A roleta sorteia um pilar, abre um tema de saúde mental com gancho,
              roteiro de 60 segundos e cronômetro pronto pra gravação. Direto,
              firme e humano, do jeito Geração Serena.
            </p>
          </div>
        )}
      </div>

      <footer className="mt-auto pt-4 text-center text-xs text-[#5f7790]">
        Conteúdo educativo sobre controle e manejo da ansiedade. Não substitui
        avaliação profissional.
      </footer>

      <Historico
        aberto={historicoAberto}
        ids={historico}
        onFechar={() => setHistoricoAberto(false)}
        onLimpar={limpar}
        onEscolher={escolherDoHistorico}
      />
    </main>
  );
}
