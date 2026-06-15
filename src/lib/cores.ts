import type { Pilar } from "@/data/temas";

// Cor de cada pilar, usada nos gomos da roleta e nas etiquetas.
export const CORES_PILAR: Record<Pilar, string> = {
  Corpo: "#0d2137",
  Mente: "#1a7a8a",
  Cérebro: "#2e5a7a",
  Energia: "#c49e5a",
  Vida: "#3a6b52",
  Engajamento: "#8a5a3a",
};

export const PILARES: Pilar[] = [
  "Corpo",
  "Mente",
  "Cérebro",
  "Energia",
  "Vida",
  "Engajamento",
];

// Texto legivel para contraste sobre cada cor de pilar.
export const TEXTO_SOBRE_PILAR: Record<Pilar, string> = {
  Corpo: "#f4f1ea",
  Mente: "#f4f1ea",
  Cérebro: "#f4f1ea",
  Energia: "#0d2137",
  Vida: "#f4f1ea",
  Engajamento: "#f4f1ea",
};
