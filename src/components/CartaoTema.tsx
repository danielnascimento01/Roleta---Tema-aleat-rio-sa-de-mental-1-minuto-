"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Tema } from "@/data/temas";
import { CORES_PILAR } from "@/lib/cores";
import { blocoCopiavel, gerarRoteiro } from "@/lib/roteiro";

interface Props {
  tema: Tema;
  onGirarDeNovo: () => void;
  onIniciarGravacao: () => void;
}

export default function CartaoTema({
  tema,
  onGirarDeNovo,
  onIniciarGravacao,
}: Props) {
  const [copiado, setCopiado] = useState(false);
  const roteiro = gerarRoteiro(tema);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(blocoCopiavel(tema));
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1800);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full rounded-2xl border border-serena-dourado/30 bg-[#102a45]/80 p-6 shadow-xl backdrop-blur sm:p-8"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold text-[#f4f1ea]"
          style={{ backgroundColor: CORES_PILAR[tema.pilar] }}
        >
          {tema.pilar}
        </span>
        <span className="rounded-full border border-serena-dourado/40 px-3 py-1 text-xs font-medium text-serena-dourado">
          {tema.formato}
        </span>
        <span className="rounded-full bg-[#13314c] px-3 py-1 text-xs font-medium text-[#cdd8e3]">
          {tema.apresentador === "Qualquer"
            ? "Qualquer apresentador"
            : `Dr(a). ${tema.apresentador}`}
        </span>
      </div>

      <h2 className="font-title text-3xl font-bold leading-tight text-[#f4f1ea] sm:text-4xl">
        {tema.tema}
      </h2>

      <p className="mt-4 border-l-2 border-serena-dourado pl-4 text-lg italic text-[#dbe4ee]">
        {tema.gancho}
      </p>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-serena-dourado">
          Mini-roteiro de 60s
        </h3>
        <ul className="space-y-2.5">
          {roteiro.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm text-[#cdd8e3]">
              <span className="shrink-0 rounded bg-[#13314c] px-2 py-0.5 font-mono text-xs text-serena-dourado">
                {b.tempo}
              </span>
              <span className="leading-relaxed">{b.texto}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onIniciarGravacao}
          className="flex-1 rounded-full bg-serena-dourado px-5 py-3 text-center font-semibold text-serena-azul transition hover:brightness-105 sm:flex-none"
        >
          Iniciar gravação (60s)
        </button>
        <button
          type="button"
          onClick={copiar}
          aria-live="polite"
          className="rounded-full border border-serena-dourado/60 px-5 py-3 font-medium text-serena-dourado transition hover:bg-serena-dourado/10"
        >
          {copiado ? "Copiado ✓" : "Copiar tema"}
        </button>
        <button
          type="button"
          onClick={onGirarDeNovo}
          className="rounded-full border border-[#2e5a7a] px-5 py-3 font-medium text-[#cdd8e3] transition hover:bg-[#13314c]"
        >
          Girar de novo
        </button>
      </div>
    </motion.article>
  );
}
