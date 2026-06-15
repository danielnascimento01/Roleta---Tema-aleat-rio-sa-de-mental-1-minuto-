"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Tema } from "@/data/temas";
import { CORES_PILAR, TEXTO_SOBRE_PILAR } from "@/lib/cores";
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
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-3xl border border-[#ece7db] bg-white p-6 text-center shadow-[0_18px_50px_rgba(13,33,55,0.1)] sm:p-9"
    >
      <div className="mb-5 flex justify-center">
        <span
          className="rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider"
          style={{
            backgroundColor: CORES_PILAR[tema.pilar],
            color: TEXTO_SOBRE_PILAR[tema.pilar],
          }}
        >
          {tema.pilar}
        </span>
      </div>

      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-serena-dourado">
        Seu tema
      </p>
      <h2 className="mx-auto mt-3 max-w-xl font-body text-[1.7rem] font-bold leading-[1.18] text-serena-azul sm:text-[2.1rem]">
        {tema.tema}
      </h2>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[#5d6f80]">
        Agora é com você. Fale sobre isso enquanto os 60 segundos correm.
      </p>

      <div className="mx-auto my-7 h-px w-24 bg-[#ece7db]" />

      <Cronometro mudo={mudo} />

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onGirarDeNovo}
          className="rounded-full bg-serena-azul px-7 py-3 font-semibold text-white shadow-sm transition hover:brightness-110"
        >
          Girar de novo
        </button>
        <button
          type="button"
          onClick={copiar}
          aria-live="polite"
          className="rounded-full border border-[#dfe4ea] px-6 py-3 font-medium text-[#5d6f80] transition hover:border-serena-azul/30"
        >
          {copiado ? "Copiado ✓" : "Copiar tema"}
        </button>
      </div>
    </motion.article>
  );
}
