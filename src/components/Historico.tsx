"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Tema } from "@/data/temas";
import { TEMAS } from "@/data/temas";
import { CORES_PILAR } from "@/lib/cores";

interface Props {
  aberto: boolean;
  ids: number[];
  onFechar: () => void;
  onLimpar: () => void;
  onEscolher: (tema: Tema) => void;
}

export default function Historico({
  aberto,
  ids,
  onFechar,
  onLimpar,
  onEscolher,
}: Props) {
  const itens = ids
    .map((id) => TEMAS.find((t) => t.id === id))
    .filter((t): t is Tema => Boolean(t));

  return (
    <AnimatePresence>
      {aberto && (
        <>
          <motion.div
            className="fixed inset-0 z-30 bg-serena-azul/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onFechar}
            aria-hidden="true"
          />
          <motion.aside
            className="fixed right-0 top-0 z-40 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            role="dialog"
            aria-label="Histórico de sorteios"
          >
            <div className="flex items-center justify-between border-b border-[#eceae3] px-5 py-4">
              <h2 className="font-title text-2xl font-semibold text-serena-azul">
                Histórico
              </h2>
              <button
                type="button"
                onClick={onFechar}
                aria-label="Fechar histórico"
                className="rounded-full p-1.5 text-[#5d6f80] transition hover:bg-[#f3f1ec] hover:text-serena-azul"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {itens.length === 0 ? (
                <p className="mt-8 text-center text-sm text-[#8a98a6]">
                  Nenhum tema sorteado ainda. Gire a roleta para começar.
                </p>
              ) : (
                <ul className="space-y-2">
                  {itens.map((t, i) => (
                    <li key={`${t.id}-${i}`}>
                      <button
                        type="button"
                        onClick={() => onEscolher(t)}
                        className="flex w-full items-start gap-3 rounded-xl border border-[#eceae3] bg-[#fbfaf7] p-3 text-left transition hover:border-serena-dourado/60"
                      >
                        <span
                          className="mt-1 h-3 w-3 shrink-0 rounded-full"
                          style={{ backgroundColor: CORES_PILAR[t.pilar] }}
                        />
                        <span>
                          <span className="block text-sm font-medium text-serena-azul">
                            {t.tema}
                          </span>
                          <span className="mt-0.5 block text-xs text-[#8a98a6]">
                            {t.pilar}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {itens.length > 0 && (
              <div className="border-t border-[#eceae3] px-5 py-4">
                <button
                  type="button"
                  onClick={onLimpar}
                  className="w-full rounded-full border border-[#e0b9a0] px-4 py-2.5 text-sm font-medium text-[#b56a40] transition hover:bg-[#fbf1ea]"
                >
                  Limpar histórico
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
