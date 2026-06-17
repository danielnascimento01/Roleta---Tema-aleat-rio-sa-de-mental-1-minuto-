"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Pilar, Tema } from "@/data/temas";
import Desafio from "@/components/Desafio";
import Escolha from "@/components/Escolha";
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

type Etapa = "escolha" | "roleta";

export default function Home() {
  const [etapa, setEtapa] = useState<Etapa>("escolha");
  const [selecionados, setSelecionados] = useState<Pilar[]>([...PILARES]);
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

  function irParaRoleta() {
    setTema(null);
    setEtapa("roleta");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function voltarParaEscolha() {
    setTema(null);
    setGirando(false);
    setEtapa("escolha");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function escolherDoHistorico(t: Tema) {
    setTema(t);
    setEtapa("roleta");
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
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-start justify-between gap-3"
      >
        <div>
          <h1 className="text-[2rem] font-bold leading-none tracking-tight text-serena-azul sm:text-[2.4rem]">
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

      {etapa === "escolha" ? (
        <Escolha
          selecionados={selecionados}
          onMudar={setSelecionados}
          onConfirmar={irParaRoleta}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={voltarParaEscolha}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e6e2d8] px-4 py-2 text-sm font-medium text-[#5d6f80] transition hover:border-serena-dourado hover:text-serena-dourado"
            >
              <span aria-hidden="true">‹</span> Trocar temas
            </button>
            <span className="text-xs font-medium text-[#9aa6b2]">
              {selecionados.length}{" "}
              {selecionados.length === 1 ? "tema" : "temas"} na roleta
            </span>
          </div>

          <motion.section
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center pt-1"
          >
            <Roleta
              ativos={selecionados}
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
        </>
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
