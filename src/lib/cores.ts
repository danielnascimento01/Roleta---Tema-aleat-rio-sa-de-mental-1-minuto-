import type { Pilar } from "@/data/temas";

// Cores vivas de cada pilar para a roleta destacar sobre o fundo branco.
// Mantem a identidade de cada pilar, porem mais viva e saturada.
export const CORES_PILAR: Record<Pilar, string> = {
  Corpo: "#1f6fd0", // azul vivo
  Mente: "#13b5c4", // teal vivo
  Cérebro: "#4f8fe0", // azul ceu
  Energia: "#f0b13e", // dourado vivo
  Vida: "#3fb06a", // verde vivo
  Engajamento: "#e07f43", // terracota vivo
};

export const PILARES: Pilar[] = [
  "Corpo",
  "Mente",
  "Cérebro",
  "Energia",
  "Vida",
  "Engajamento",
];

// Cor do texto sobre cada gomo, garantindo contraste.
export const TEXTO_SOBRE_PILAR: Record<Pilar, string> = {
  Corpo: "#ffffff",
  Mente: "#06343a",
  Cérebro: "#ffffff",
  Energia: "#3d2c08",
  Vida: "#06301a",
  Engajamento: "#ffffff",
};
