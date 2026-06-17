"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import type { Pilar } from "@/data/temas";
import { CORES_PILAR, PILARES } from "@/lib/cores";
import { clique } from "@/lib/som";

const CX = 150;
const CY = 150;
const R = 138;
const FATIAS = 24; // muitas subdivisoes, estilo roleta de premios
const PASSO = 360 / FATIAS; // 15

// Pilar e cor de cada fatia: cicla os 6 pilares para alternar as cores
// vivas e garantir contraste entre fatias vizinhas.
function pilarDaFatia(i: number): Pilar {
  return PILARES[i % PILARES.length];
}

function ponto(anguloGraus: number, raio: number) {
  const rad = (anguloGraus * Math.PI) / 180;
  return { x: CX + raio * Math.sin(rad), y: CY - raio * Math.cos(rad) };
}

function caminhoSetor(indice: number): string {
  const inicio = indice * PASSO;
  const fim = inicio + PASSO;
  const p1 = ponto(inicio, R);
  const p2 = ponto(fim, R);
  return `M ${CX} ${CY} L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${R} ${R} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Z`;
}

interface Props {
  ativos: Pilar[]; // temas escolhidos no passo 1: onde a roda pode parar
  girando: boolean;
  mudo: boolean;
  onInicio: () => void;
  onResultado: (pilar: Pilar) => void;
}

export default function Roleta({
  ativos,
  girando,
  mudo,
  onInicio,
  onResultado,
}: Props) {
  const rotacao = useMotionValue(0);
  const atual = useRef(0);
  const [foco, setFoco] = useState<number | null>(null);

  const tocarCliques = useCallback(
    (duracaoMs: number) => {
      if (mudo) return;
      let t = 0;
      let intervalo = 55;
      while (t < duracaoMs) {
        window.setTimeout(() => clique(), t);
        intervalo += 14;
        t += intervalo;
      }
    },
    [mudo]
  );

  const girar = useCallback(async () => {
    if (girando || ativos.length === 0) return;

    // sorteia o tema entre os escolhidos, depois escolhe uma das fatias
    // daquele pilar para o ponteiro parar.
    const alvo = ativos[Math.floor(Math.random() * ativos.length)];
    const idxPilar = PILARES.indexOf(alvo);
    const fatiasDoAlvo: number[] = [];
    for (let i = 0; i < FATIAS; i++) {
      if (i % PILARES.length === idxPilar) fatiasDoAlvo.push(i);
    }
    const fatia =
      fatiasDoAlvo[Math.floor(Math.random() * fatiasDoAlvo.length)];
    setFoco(null);

    const centro = fatia * PASSO + PASSO / 2;
    const jitter = (Math.random() - 0.5) * (PASSO * 0.5);
    const destinoMod = (360 - centro - jitter + 360) % 360;

    const atualMod = ((atual.current % 360) + 360) % 360;
    let delta = destinoMod - atualMod;
    if (delta <= 0) delta += 360;
    const voltas = 4 + Math.floor(Math.random() * 2);
    const novaRotacao = atual.current + delta + voltas * 360;
    atual.current = novaRotacao;

    const duracao = 3.4 + Math.random() * 1.4;
    onInicio();
    tocarCliques(duracao * 1000);

    await animate(rotacao, novaRotacao, {
      duration: duracao,
      ease: [0.34, 0.0, 0.16, 1],
    });

    setFoco(fatia);
    onResultado(alvo);
  }, [ativos, girando, onInicio, onResultado, rotacao, tocarCliques]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[19rem] select-none sm:max-w-[22rem]">
      <div
        className="pointer-events-none absolute inset-[-8%] rounded-full opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(196,158,90,0.22), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-1/2 top-[-10px] z-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <svg width="30" height="40" viewBox="0 0 30 40">
          <path
            d="M15 38 L4 12 Q15 4 26 12 Z"
            fill="#0d2137"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="15" cy="14" r="2.6" fill="#c49e5a" />
        </svg>
      </div>

      <motion.div
        className="absolute inset-0"
        style={{ rotate: rotacao, transformOrigin: "50% 50%" }}
      >
        <svg
          viewBox="0 0 300 300"
          className="h-full w-full drop-shadow-[0_16px_34px_rgba(13,33,55,0.22)]"
          role="img"
          aria-label="Roleta de temas de saude mental"
        >
          <defs>
            <linearGradient id="aroGrad" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0" stopColor="#f1dcae" />
              <stop offset="0.5" stopColor="#c49e5a" />
              <stop offset="1" stopColor="#9c7c41" />
            </linearGradient>
            <radialGradient id="brilhoGomo" cx="0.5" cy="0.32" r="0.7">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.03" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r={R + 7} fill="url(#aroGrad)" />
          <circle
            cx={CX}
            cy={CY}
            r={R + 2.5}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.85"
          />

          {Array.from({ length: FATIAS }, (_, i) => (
            <path
              key={i}
              d={caminhoSetor(i)}
              fill={CORES_PILAR[pilarDaFatia(i)]}
              stroke="#ffffff"
              strokeWidth="1.5"
              style={{
                filter:
                  foco === i ? "brightness(1.18) saturate(1.2)" : undefined,
                transition: "filter 0.25s",
              }}
            />
          ))}

          {/* marcas finas no aro, reforcando as muitas divisoes */}
          {Array.from({ length: FATIAS }, (_, i) => {
            const a = i * PASSO;
            const p1 = ponto(a, R);
            const p2 = ponto(a, R + 6);
            return (
              <line
                key={`t-${i}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#ffffff"
                strokeWidth="1.5"
                opacity="0.7"
              />
            );
          })}

          <circle cx={CX} cy={CY} r={R} fill="url(#brilhoGomo)" pointerEvents="none" />

          <circle cx={CX} cy={CY} r="41" fill="#ffffff" />
          <circle cx={CX} cy={CY} r="38" fill="url(#aroGrad)" />
          <circle cx={CX} cy={CY} r="34" fill="#0d2137" />
        </svg>
      </motion.div>

      <button
        type="button"
        onClick={girar}
        disabled={girando || ativos.length === 0}
        aria-label="Girar a roleta"
        className={`absolute left-1/2 top-1/2 z-10 flex h-[4.6rem] w-[4.6rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-serena-dourado bg-serena-azul text-base font-bold uppercase tracking-[0.14em] text-serena-dourado outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${
          girando ? "" : "respiro hover:scale-[1.05]"
        }`}
      >
        {girando ? <span className="text-lg">···</span> : <span>Girar</span>}
      </button>
    </div>
  );
}
