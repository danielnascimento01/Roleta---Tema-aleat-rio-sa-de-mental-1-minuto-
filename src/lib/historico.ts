"use client";

// Historico anti-repeticao em localStorage. Guarda os ids dos ultimos
// temas sorteados, mais recentes primeiro.

const CHAVE = "roleta-serena:historico";
const LIMITE = 30;

export function lerHistorico(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return [];
    const dados = JSON.parse(bruto);
    if (!Array.isArray(dados)) return [];
    return dados.filter((x): x is number => typeof x === "number");
  } catch {
    return [];
  }
}

export function registrarSorteio(id: number): number[] {
  const atual = lerHistorico().filter((x) => x !== id);
  const novo = [id, ...atual].slice(0, LIMITE);
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(novo));
  } catch {
    // ignora falhas de quota ou modo privado
  }
  return novo;
}

export function limparHistorico(): void {
  try {
    window.localStorage.removeItem(CHAVE);
  } catch {
    // ignora
  }
}
