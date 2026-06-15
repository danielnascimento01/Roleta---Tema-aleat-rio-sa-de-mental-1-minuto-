"use client";

import { useAnimationControls, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import type { Pilar } from "@/data/temas";
import { CORES_PILAR, PILARES, TEXTO_SOBRE_PILAR } from "@/lib/cores";
import { clique } from "@/lib/som";

const CX = 150;
const CY = 150;
const R = 140;
const LABEL_R = 92;
const SETORES = PILARES.length; // 6
const PASSO = 360 / SETORES; // 60

// Ponto na circunferencia para um angulo medido em graus, horario a partir
// do topo (12h).
function ponto(anguloGraus: number, raio: number) {
  const rad = (anguloGraus * Math.PI) / 180;
  return {
    x: CX + raio * Math.sin(rad),
    y: CY - raio * Math.cos(rad),
  };
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
        // os cliques vao espacando conforme a roda desacelera
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

    // centro do setor, horario a partir do topo
    const centro = indice * PASSO + PASSO / 2;
    // pequena variacao para nao parar sempre no centro exato
    const jitter = (Math.random() - 0.5) * (PASSO * 0.6);
    const destinoMod = (360 - centro - jitter + 360) % 360;

    const atualMod = ((rotacao.current % 360) + 360) % 360;
    let delta = destinoMod - atualMod;
    if (delta <= 0) delta += 360;
    const voltas = 4 + Math.floor(Math.random() * 2); // 4 ou 5 voltas
    const total = delta + voltas * 360;
    const novaRotacao = rotacao.current + total;
    rotacao.current = novaRotacao;

    const duracao = 3.4 + Math.random() * 1.4; // 3.4 a 4.8s
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
    <div className="relative mx-auto aspect-square w-full max-w-[22rem] select-none">
      {/* Ponteiro fixo no topo */}
      <div
        className="pointer-events-none absolute left-1/2 top-[-6px] z-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <svg width="34" height="30" viewBox="0 0 34 30">
          <path
            d="M17 30 L2 2 Q17 10 32 2 Z"
            fill="#c49e5a"
            stroke="#0d2137"
            strokeWidth="1.5"
          />
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
          className="h-full w-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          role="img"
          aria-label="Roleta de pilares de saude mental"
        >
          <circle cx={CX} cy={CY} r={R + 4} fill="#c49e5a" />
          {PILARES.map((pilar, i) => {
            const ligado = ativo(pilar);
            return (
              <path
                key={pilar}
                d={caminhoSetor(i)}
                fill={CORES_PILAR[pilar]}
                stroke="#0a1a2c"
                strokeWidth="1.5"
                opacity={ligado ? 1 : 0.22}
                style={{
                  filter: foco === i ? "brightness(1.25)" : undefined,
                  transition: "filter 0.2s",
                }}
              />
            );
          })}
          {PILARES.map((pilar, i) => {
            const centro = i * PASSO + PASSO / 2;
            const pos = ponto(centro, LABEL_R);
            const flip = centro > 90 && centro < 270;
            const transform = flip
              ? `rotate(${centro} ${CX} ${CY}) rotate(180 ${pos.x} ${pos.y})`
              : `rotate(${centro} ${CX} ${CY})`;
            return (
              <text
                key={`l-${pilar}`}
                x={pos.x}
                y={pos.y}
                transform={transform}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                fontWeight="600"
                fill={TEXTO_SOBRE_PILAR[pilar]}
                opacity={ativo(pilar) ? 1 : 0.35}
                style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
              >
                {pilar}
              </text>
            );
          })}
          <circle cx={CX} cy={CY} r="34" fill="#0d2137" stroke="#c49e5a" strokeWidth="2" />
        </svg>
      </motion.div>

      {/* Botao central GIRAR */}
      <button
        type="button"
        onClick={girar}
        disabled={girando || pilaresAtivos.length === 0}
        aria-label="Girar a roleta"
        className="absolute left-1/2 top-1/2 z-10 flex h-[5.2rem] w-[5.2rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-serena-dourado font-title text-lg font-bold text-serena-azul shadow-lg outline-none ring-serena-dourado transition hover:brightness-105 focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {girando ? "..." : "GIRAR"}
      </button>
    </div>
  );
}
