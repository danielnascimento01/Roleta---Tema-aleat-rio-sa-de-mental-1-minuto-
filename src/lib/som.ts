"use client";

// Sons discretos via Web Audio API, sem arquivos externos. Tudo
// desligavel. Cria o contexto sob demanda (apos interacao do usuario).

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function beep(freq: number, duracao: number, volume: number) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(c.destination);
  const agora = c.currentTime;
  gain.gain.linearRampToValueAtTime(volume, agora + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, agora + duracao);
  osc.start(agora);
  osc.stop(agora + duracao);
}

// Clique curto e discreto para os gomos passando no ponteiro.
export function clique() {
  beep(880, 0.04, 0.05);
}

// Alerta de contagem regressiva: faltando 5 segundos. Dois toques curtos
// e mais audiveis para avisar quem esta gravando.
export function sinalCinco() {
  beep(990, 0.16, 0.1);
  window.setTimeout(() => beep(990, 0.16, 0.1), 230);
}

// Sinal suave ao zerar o cronometro.
export function sinalFim() {
  beep(660, 0.18, 0.08);
  window.setTimeout(() => beep(520, 0.22, 0.08), 180);
}
