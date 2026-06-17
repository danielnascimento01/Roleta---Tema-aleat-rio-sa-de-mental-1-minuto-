"use client";

import { motion } from "framer-motion";
import type { Pilar } from "@/data/temas";
import { CORES_PILAR, PILARES } from "@/lib/cores";

// Descricao amigavel de cada tema (pilar) para a tela de escolha.
const TOPICOS: Record<Pilar, { desc: string; quem: string }> = {
  Corpo: { desc: "Sintomas físicos, coração e crises", quem: "Dr. Carlos" },
  Mente: { desc: "Pensamentos, emoções e técnicas", quem: "Marina" },
  Cérebro: { desc: "Cérebro, tratamento e quando buscar ajuda", quem: "Dr. Henrique" },
  Energia: { desc: "Sono, rotina, hábitos e cafeína", quem: "Qualquer um" },
  Vida: { desc: "Relações, propósito e limites", quem: "Qualquer um" },
  Engajamento: { desc: "Mitos, perguntas e interação", quem: "Qualquer um" },
};

interface Props {
  selecionados: Pilar[];
  onMudar: (p: Pilar[]) => void;
  onConfirmar: () => void;
}

export default function Escolha({ selecionados, onMudar, onConfirmar }: Props) {
  function toggle(p: Pilar) {
    onMudar(
      selecionados.includes(p)
        ? selecionados.filter((x) => x !== p)
        : [...selecionados, p]
    );
  }

  const todosMarcados = selecionados.length === PILARES.length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="text-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-serena-dourado">
          Passo 1
        </p>
        <h2 className="mt-2 text-2xl font-bold leading-tight text-serena-azul sm:text-3xl">
          O que você quer falar hoje?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#5d6f80]">
          Escolha um ou mais temas. A roleta vai sortear só entre eles.
        </p>
      </div>

      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => onMudar(todosMarcados ? [] : [...PILARES])}
          className="rounded-full border border-[#e6e2d8] px-4 py-1.5 text-xs font-semibold text-[#5d6f80] transition hover:border-serena-dourado hover:text-serena-dourado"
        >
          {todosMarcados ? "Limpar seleção" : "Selecionar todos"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PILARES.map((pilar) => {
          const ativo = selecionados.includes(pilar);
          const cor = CORES_PILAR[pilar];
          return (
            <button
              key={pilar}
              type="button"
              onClick={() => toggle(pilar)}
              aria-pressed={ativo}
              className="group relative flex items-start gap-3 rounded-2xl border bg-white p-4 text-left transition"
              style={{
                borderColor: ativo ? cor : "#e9e5db",
                boxShadow: ativo ? `0 6px 18px ${cor}22` : "none",
              }}
            >
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: cor }}
                aria-hidden="true"
              >
                {ativo ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-white/80" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-base font-bold text-serena-azul">
                  {pilar}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-[#5d6f80]">
                  {TOPICOS[pilar].desc}
                </span>
                <span
                  className="mt-1.5 inline-block text-[0.68rem] font-semibold uppercase tracking-wide"
                  style={{ color: cor }}
                >
                  {TOPICOS[pilar].quem}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onConfirmar}
        disabled={selecionados.length === 0}
        className="mx-auto mt-1 w-full max-w-xs rounded-full bg-serena-azul px-7 py-3.5 text-center font-bold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Ir para a roleta
        <span aria-hidden="true"> →</span>
      </button>
      {selecionados.length === 0 && (
        <p className="-mt-3 text-center text-xs text-[#b56a40]">
          Selecione pelo menos um tema para continuar.
        </p>
      )}
    </motion.section>
  );
}
