"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Pilar, Tema } from "@/data/temas";
import Desafio from "@/components/Desafio";
import Historico from "@/components/Historico";
import Roleta from "@/components/Roleta";
import { PILARES } from "@/lib/cores";
import {
  lerHistorico,
  limparHistorico,
  registrarSorteio,
} from "@/lib/historico";
import { sortearPorPilar } from "@/lib/sorteio";

const FILTROS_PADRAO = { apresentador: "Todos", formato: "Todos" } as const;

export default function Home() {
  const [tema, setTema] = useState<Tema | null>(null);
  const [girando, setGirando] = useState(false);
  const [mudo, setMudo] = useState(false);
  const [historico, setHistorico] = useState<number[]>([]);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const resultadoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistorico(lerHistorico());
  }, []);

  function aoSortearTema(novo: Tema | null) {
    if (!novo) return;
    setTema(novo);
    setHistorico(registrarSorteio(novo.id));
    window.setTimeout(() => {
      resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 90);
  }

  function aoResultadoRoleta(pilar: Pilar) {
    setGirando(false);
    aoSortearTema(sortearPorPilar(pilar, FILTROS_PADRAO, historico));
  }

  function escolherDoHistorico(t: Tema) {
    setTema(t);
    setHistoricoAberto(false);
    window.setTimeout(() => {
      resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 90);
  }

  function limpar() {
    limparHistorico();
    setHistorico([]);
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-xl flex-col gap-8 px-5 pb-16 pt-7 sm:px-6">
      {/* Cabecalho */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-start justify-between gap-3"
      >
        <div>
          <h1 className="font-title text-[2rem] font-bold leading-none tracking-tight text-serena-azul sm:text-[2.4rem]">
            Geração Serena <span aria-hidden="true">🌿</span>
          </h1>
          <p className="mt-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-serena-dourado">
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
            className="rounded-full border border-[#e6e2d8] p-2.5 text-serena-azul transition hover:border-serena-dourado hover:text-serena-dourado"
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
            className="rounded-full border border-[#e6e2d8] p-2.5 text-serena-azul transition hover:border-serena-dourado hover:text-serena-dourado"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.05 11a9 9 0 1 1 .5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 4v4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </motion.header>

      <div className="divisor" aria-hidden="true" />

      {/* Roleta, o coracao da pagina */}
      <motion.section
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center pt-2"
      >
        <Roleta
          pilaresAtivos={PILARES}
          girando={girando}
          mudo={mudo}
          onInicio={() => setGirando(true)}
          onResultado={aoResultadoRoleta}
        />
      </motion.section>

      {tema && (
        <div ref={resultadoRef} className="scroll-mt-6">
          <Desafio
            tema={tema}
            mudo={mudo}
            onGirarDeNovo={() => {
              setTema(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}

      <footer className="mt-auto pt-6 text-center text-[0.7rem] leading-relaxed text-[#9aa6b2]">
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
