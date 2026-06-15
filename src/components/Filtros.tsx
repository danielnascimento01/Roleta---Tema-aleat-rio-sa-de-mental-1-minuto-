"use client";

import type { Apresentador, Formato, Pilar } from "@/data/temas";
import { CORES_PILAR, PILARES } from "@/lib/cores";
import type { Filtros as FiltrosTipo } from "@/lib/sorteio";

const APRESENTADORES: (Apresentador | "Todos")[] = [
  "Todos",
  "Carlos",
  "Henrique",
  "Marina",
];

const FORMATOS: (Formato | "Todos")[] = [
  "Todos",
  "Explicação",
  "Técnica",
  "Mito vs Verdade",
  "Pergunta de paciente",
  "Gancho",
];

interface Props {
  filtros: FiltrosTipo;
  onMudar: (f: FiltrosTipo) => void;
}

export default function Filtros({ filtros, onMudar }: Props) {
  function togglePilar(p: Pilar) {
    const ativo = filtros.pilares.includes(p);
    const pilares = ativo
      ? filtros.pilares.filter((x) => x !== p)
      : [...filtros.pilares, p];
    onMudar({ ...filtros, pilares });
  }

  return (
    <div className="w-full space-y-5 rounded-2xl border border-[#1d3b58] bg-[#0f2640]/60 p-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-serena-dourado">
          Apresentador
        </p>
        <div className="flex flex-wrap gap-2">
          {APRESENTADORES.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={filtros.apresentador === a}
              onClick={() => onMudar({ ...filtros, apresentador: a })}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                filtros.apresentador === a
                  ? "bg-serena-dourado text-serena-azul"
                  : "bg-[#13314c] text-[#cdd8e3] hover:bg-[#1a3d5c]"
              }`}
            >
              {a === "Todos" ? "Todos" : `Dr(a). ${a}`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-serena-dourado">
          Pilares na roleta
        </p>
        <div className="flex flex-wrap gap-2">
          {PILARES.map((p) => {
            const ligado = filtros.pilares.includes(p);
            return (
              <button
                key={p}
                type="button"
                aria-pressed={ligado}
                onClick={() => togglePilar(p)}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition"
                style={{
                  borderColor: ligado ? CORES_PILAR[p] : "#1d3b58",
                  backgroundColor: ligado ? `${CORES_PILAR[p]}33` : "transparent",
                  color: ligado ? "#f4f1ea" : "#7e93a8",
                }}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CORES_PILAR[p], opacity: ligado ? 1 : 0.4 }}
                />
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-serena-dourado">
          Formato
        </p>
        <div className="flex flex-wrap gap-2">
          {FORMATOS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filtros.formato === f}
              onClick={() => onMudar({ ...filtros, formato: f })}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                filtros.formato === f
                  ? "bg-serena-dourado text-serena-azul"
                  : "bg-[#13314c] text-[#cdd8e3] hover:bg-[#1a3d5c]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
