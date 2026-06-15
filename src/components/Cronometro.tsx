"use client";

import { useEffect, useRef, useState } from "react";
import { sinalFim } from "@/lib/som";

const RAIO = 120;
const CIRC = 2 * Math.PI * RAIO;

interface Props {
  mudo: boolean;
}

const DURACOES = [30, 60, 90];

export default function Cronometro({ mudo }: Props) {
  const [total, setTotal] = useState(60);
  const [restante, setRestante] = useState(60);
  const [rodando, setRodando] = useState(false);
  const tickRef = useRef<number | null>(null);
  const fimRef = useRef(false);

  useEffect(() => {
    if (!rodando) return;
    const inicio = Date.now();
    const base = restante;
    tickRef.current = window.setInterval(() => {
      const passado = (Date.now() - inicio) / 1000;
      const novo = Math.max(0, base - passado);
      setRestante(novo);
      if (novo <= 0) {
        setRodando(false);
        if (!fimRef.current) {
          fimRef.current = true;
          if (!mudo) sinalFim();
        }
      }
    }, 100);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rodando]);

  function iniciar() {
    if (restante <= 0) setRestante(total);
    fimRef.current = false;
    setRodando(true);
  }

  function pausar() {
    setRodando(false);
  }

  function reiniciar() {
    setRodando(false);
    fimRef.current = false;
    setRestante(total);
  }

  function trocarDuracao(d: number) {
    setRodando(false);
    fimRef.current = false;
    setTotal(d);
    setRestante(d);
  }

  const ultimos10 = restante <= 10 && restante > 0;
  const corAnel = ultimos10 ? "#c49e5a" : "#13b5c4";
  const progresso = total > 0 ? restante / total : 0;
  const offset = CIRC * (1 - progresso);

  const minutos = Math.floor(restante / 60);
  const segundos = Math.floor(restante % 60);
  const texto =
    total >= 60
      ? `${minutos}:${segundos.toString().padStart(2, "0")}`
      : `${Math.ceil(restante)}`;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-64 w-64 sm:h-72 sm:w-72">
        <svg viewBox="0 0 300 300" className="h-full w-full -rotate-90">
          <circle
            cx="150"
            cy="150"
            r={RAIO}
            fill="none"
            stroke="#eef1f4"
            strokeWidth="14"
          />
          <circle
            cx="150"
            cy="150"
            r={RAIO}
            fill="none"
            stroke={corAnel}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.1s linear, stroke 0.3s" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-body text-[5rem] font-extrabold leading-none tabular-nums tracking-tight sm:text-[6rem] ${
              ultimos10 ? "text-serena-dourado" : "text-serena-azul"
            }`}
            aria-live="polite"
          >
            {texto}
          </span>
          <span className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#8a98a6]">
            {rodando ? "gravando" : restante <= 0 ? "fim" : "pronto"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {DURACOES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => trocarDuracao(d)}
            aria-pressed={total === d}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              total === d
                ? "bg-serena-azul text-white"
                : "border border-[#dfe4ea] text-[#5d6f80] hover:border-serena-azul/30"
            }`}
          >
            {d}s
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {!rodando ? (
          <button
            type="button"
            onClick={iniciar}
            className="rounded-full bg-serena-dourado px-7 py-2.5 font-semibold text-serena-azul shadow-sm transition hover:brightness-105"
          >
            {restante <= 0 ? "De novo" : restante === total ? "Iniciar" : "Continuar"}
          </button>
        ) : (
          <button
            type="button"
            onClick={pausar}
            className="rounded-full border-2 border-serena-dourado px-7 py-2.5 font-semibold text-serena-dourado transition hover:bg-serena-dourado/10"
          >
            Pausar
          </button>
        )}
        <button
          type="button"
          onClick={reiniciar}
          className="rounded-full border border-[#dfe4ea] px-6 py-2.5 font-medium text-[#5d6f80] transition hover:border-serena-azul/30"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
