"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Tema } from "@/data/temas";
import { CORES_PILAR } from "@/lib/cores";
import Cronometro from "@/components/Cronometro";

interface Props {
  tema: Tema;
  mudo: boolean;
  onGirarDeNovo: () => void;
}

// Tela do desafio: a roleta trouxe um tema, agora e so falar sobre ele
// enquanto os 60 segundos correm. Nada de roteiro nem instrucao.
export default function Desafio({ tema, mudo, onGirarDeNovo }: Props) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(tema.tema);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1600);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full rounded-2xl border border-serena-dourado/30 bg-[#102a45]/80 p-6 text-center shadow-xl backdrop-blur sm:p-8"
    >
      <div className="mb-4 flex justify-center">
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#f4f1ea]"
          style={{ backgroundColor: CORES_PILAR[tema.pilar] }}
        >
          {tema.pilar}
        </span>
      </div>

      <p className="text-xs uppercase tracking-[0.25em] text-serena-dourado">
        Seu tema
      </p>
      <h2 className="mx-auto mt-2 max-w-xl font-title text-3xl font-bold leading-tight text-[#f4f1ea] sm:text-4xl">
        {tema.tema}
      </h2>
      <p className="mt-3 text-sm text-[#9fb2c5]">
        Agora é com você: fale sobre isso enquanto os 60 segundos correm.
      </p>

      <div className="mt-8">
        <Cronometro mudo={mudo} />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onGirarDeNovo}
          className="rounded-full bg-serena-dourado px-6 py-3 font-semibold text-serena-azul transition hover:brightness-105"
        >
          Girar de novo
        </button>
        <button
          type="button"
          onClick={copiar}
          aria-live="polite"
          className="rounded-full border border-serena-dourado/60 px-6 py-3 font-medium text-serena-dourado transition hover:bg-serena-dourado/10"
        >
          {copiado ? "Copiado ✓" : "Copiar tema"}
        </button>
      </div>
    </motion.article>
  );
}
