import uiClickUrl from "../assets/mixkit-retro-game-notification-212.wav";

export const UI_CLICK_SOUND = uiClickUrl;
export const AMBIENT_PIANO_SOUND = "/piano.mp3";

let uiClickAudio: HTMLAudioElement | null = null;

export function playSound(src: string) {
  if (typeof window === "undefined" || !src) return;

  const audio = new Audio(src);
  audio.currentTime = 0;
  void audio.play().catch(() => {});
}

export function playUiClickSound() {
  if (typeof window === "undefined") return;

  if (!uiClickAudio) {
    uiClickAudio = new Audio(UI_CLICK_SOUND);
  }

  uiClickAudio.currentTime = 0;
  void uiClickAudio.play().catch(() => {});
}
