import type { Apresentador, Formato, Pilar, Tema } from "@/data/temas";
import { TEMAS } from "@/data/temas";

export interface Filtros {
  apresentador: Apresentador | "Todos";
  pilares: Pilar[]; // pilares ligados na roleta
  formato: Formato | "Todos";
}

// Aplica os filtros de apresentador e formato. O filtro de pilar fica a
// cargo de quem chama, pois a roleta sorteia primeiro um pilar.
export function temasDisponiveis(
  filtros: Pick<Filtros, "apresentador" | "formato">
): Tema[] {
  return TEMAS.filter((t) => {
    if (filtros.apresentador !== "Todos") {
      if (t.apresentador !== filtros.apresentador && t.apresentador !== "Qualquer") {
        return false;
      }
    }
    if (filtros.formato !== "Todos" && t.formato !== filtros.formato) {
      return false;
    }
    return true;
  });
}

// Sorteia um tema de um conjunto, evitando o historico recente. Se todos
// ja sairam, ignora o historico (esgotou o pilar) e sorteia entre todos.
export function sortear(candidatos: Tema[], historico: number[]): Tema | null {
  if (candidatos.length === 0) return null;
  const frescos = candidatos.filter((t) => !historico.includes(t.id));
  const fonte = frescos.length > 0 ? frescos : candidatos;
  const indice = Math.floor(Math.random() * fonte.length);
  return fonte[indice];
}

// Sorteia respeitando um pilar especifico (vindo da roleta).
export function sortearPorPilar(
  pilar: Pilar,
  filtros: Pick<Filtros, "apresentador" | "formato">,
  historico: number[]
): Tema | null {
  const candidatos = temasDisponiveis(filtros).filter((t) => t.pilar === pilar);
  return sortear(candidatos, historico);
}

// Sorteia de todo o banco filtrado, ignorando a roleta.
export function sortearDireto(
  filtros: Filtros,
  historico: number[]
): Tema | null {
  let candidatos = temasDisponiveis(filtros);
  if (filtros.pilares.length > 0) {
    candidatos = candidatos.filter((t) => filtros.pilares.includes(t.pilar));
  }
  return sortear(candidatos, historico);
}

// Quais pilares ainda tem ao menos um tema com os filtros atuais.
export function pilaresComTema(
  filtros: Pick<Filtros, "apresentador" | "formato">
): Set<Pilar> {
  const set = new Set<Pilar>();
  for (const t of temasDisponiveis(filtros)) set.add(t.pilar);
  return set;
}
