"use client";

import { useAnimationControls, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import type { Pilar } from "@/data/temas";
import { CORES_PILAR, PILARES, TEXTO_SOBRE_PILAR } from "@/lib/cores";
import { clique } from "@/lib/som";

const CX = 150;
const CY = 150;
const R = 138;
const LABEL_R = 90;
const SETORES = PILARES.length; // 6
const PASSO = 360 / SETORES; // 60

// Ponto na circunferencia para um angulo em graus, horario a partir do topo.
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
  pilaresAtivos: Pilar[];
  girando: boolean;
  mudo: boolean;
  onInicio: () => void;
  onResultado: (pilar: Pilar) => void;
}

export default function Roleta({
  pilaresAtivos,
  girando,
  mudo,
  onInicio,
  onResultado,
}: Props) {
  const controls = useAnimationControls();
  const rotacao = useRef(0);
  const [foco, setFoco] = useState<number | null>(null);

  const ativo = useCallback(
    (p: Pilar) => pilaresAtivos.includes(p),
    [pilaresAtivos]
  );

  const tocarCliques = useCallback(
    (duracaoMs: number) => {
      if (mudo) return;
      let t = 0;
      let intervalo = 70;
      while (t < duracaoMs) {
        window.setTimeout(() => clique(), t);
        intervalo += 18;
        t += intervalo;
      }
    },
    [mudo]
  );

  const girar = useCallback(async () => {
    if (girando) return;
    if (pilaresAtivos.length === 0) return;

    const alvo = pilaresAtivos[Math.floor(Math.random() * pilaresAtivos.length)];
    const indice = PILARES.indexOf(alvo);
    setFoco(indice);

    const centro = indice * PASSO + PASSO / 2;
    const jitter = (Math.random() - 0.5) * (PASSO * 0.6);
    const destinoMod = (360 - centro - jitter + 360) % 360;

    const atualMod = ((rotacao.current % 360) + 360) % 360;
    let delta = destinoMod - atualMod;
    if (delta <= 0) delta += 360;
    const voltas = 4 + Math.floor(Math.random() * 2);
    const total = delta + voltas * 360;
    const novaRotacao = rotacao.current + total;
    rotacao.current = novaRotacao;

    const duracao = 3.4 + Math.random() * 1.4;
    onInicio();
    tocarCliques(duracao * 1000);

    await controls.start({
      rotate: novaRotacao,
      transition: { duration: duracao, ease: [0.34, 0.0, 0.16, 1] },
    });

    setFoco(null);
    onResultado(alvo);
  }, [controls, girando, onInicio, onResultado, pilaresAtivos, tocarCliques]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[19rem] select-none sm:max-w-[22rem]">
      {/* Halo dourado suave atras da roda */}
      <div
        className="pointer-events-none absolute inset-[-8%] rounded-full opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(196,158,90,0.22), transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Ponteiro fixo no topo */}
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

      {/* Roda que gira */}
      <motion.div
        className="h-full w-full"
        style={{ transformOrigin: "50% 50%" }}
        animate={controls}
      >
        <svg
          viewBox="0 0 300 300"
          className="h-full w-full drop-shadow-[0_16px_34px_rgba(13,33,55,0.22)]"
          role="img"
          aria-label="Roleta de pilares de saude mental"
        >
          <defs>
            <linearGradient id="aroGrad" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0" stopColor="#f1dcae" />
              <stop offset="0.5" stopColor="#c49e5a" />
              <stop offset="1" stopColor="#9c7c41" />
            </linearGradient>
            <radialGradient id="brilhoGomo" cx="0.5" cy="0.32" r="0.7">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Aro dourado */}
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

          {/* Gomos em cores vivas */}
          {PILARES.map((pilar, i) => {
            const ligado = ativo(pilar);
            return (
              <path
                key={pilar}
                d={caminhoSetor(i)}
                fill={CORES_PILAR[pilar]}
                stroke="#ffffff"
                strokeWidth="2"
                opacity={ligado ? 1 : 0.25}
                style={{
                  filter:
                    foco === i ? "brightness(1.12) saturate(1.15)" : undefined,
                  transition: "filter 0.25s",
                }}
              />
            );
          })}

          {/* Brilho superior para dar volume */}
          <circle cx={CX} cy={CY} r={R} fill="url(#brilhoGomo)" pointerEvents="none" />

          {/* Rotulos dos pilares (posicionados no topo e girados ate o gomo) */}
          {PILARES.map((pilar, i) => {
            const centro = i * PASSO + PASSO / 2;
            const tx = CX;
            const ty = CY - LABEL_R;
            const flip = centro > 90 && centro < 270;
            const transform = flip
              ? `rotate(${centro} ${CX} ${CY}) rotate(180 ${tx} ${ty})`
              : `rotate(${centro} ${CX} ${CY})`;
            return (
              <text
                key={`l-${pilar}`}
                x={tx}
                y={ty}
                transform={transform}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                fontWeight="700"
                letterSpacing="0.3"
                fill={TEXTO_SOBRE_PILAR[pilar]}
                opacity={ativo(pilar) ? 1 : 0.4}
                style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
              >
                {pilar}
              </text>
            );
          })}

          {/* Miolo: navy com aro dourado */}
          <circle cx={CX} cy={CY} r="41" fill="#ffffff" />
          <circle cx={CX} cy={CY} r="38" fill="url(#aroGrad)" />
          <circle cx={CX} cy={CY} r="34" fill="#0d2137" />
        </svg>
      </motion.div>

      {/* Botao central GIRAR */}
      <button
        type="button"
        onClick={girar}
        disabled={girando || pilaresAtivos.length === 0}
        aria-label="Girar a roleta"
        className={`absolute left-1/2 top-1/2 z-10 flex h-[4.6rem] w-[4.6rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-serena-dourado bg-serena-azul font-title text-base font-bold uppercase tracking-[0.14em] text-serena-dourado outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${
          girando ? "" : "respiro hover:scale-[1.05]"
        }`}
      >
        {girando ? <span className="text-lg">···</span> : <span>Girar</span>}
      </button>
    </div>
  );
}
