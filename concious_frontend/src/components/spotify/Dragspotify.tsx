import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue } from "framer-motion";
import { Spotifydrag, SPOTIFY_EMBED_HEIGHT } from "../../Embed/Spotifydrag";

interface FocusTrackCardProps {
  darkMode?: boolean;
  open?: boolean;
}

const FLOAT_Z_INDEX = 115;
const SPOTIFY_CARD_WIDTH = 280;
const VIEWPORT_MARGIN = 24;
const CARD_CHROME_HEIGHT = 44;
const CONTROL_GAP = 12;

function getFloatingControlMetrics() {
  const isLargeDesktop = window.matchMedia("(min-width: 1024px)").matches;

  return {
    isLargeDesktop,
    right: isLargeDesktop ? 20 : 16,
    musicBottom: isLargeDesktop ? 24 : 76,
    buttonSize: isLargeDesktop ? 56 : 48,
  };
}

function getAnchorPosition(cardHeight: number) {
  const { isLargeDesktop, right, musicBottom, buttonSize } =
    getFloatingControlMetrics();

  if (isLargeDesktop) {
    const xPos = Math.max(
      VIEWPORT_MARGIN,
      window.innerWidth -
        SPOTIFY_CARD_WIDTH -
        right -
        buttonSize -
        CONTROL_GAP
    );
    const yPos = Math.max(
      VIEWPORT_MARGIN,
      window.innerHeight - cardHeight - musicBottom
    );

    return { xPos, yPos };
  }

  const musicTop = window.innerHeight - musicBottom - buttonSize;
  const xPos = Math.max(
    VIEWPORT_MARGIN,
    window.innerWidth - SPOTIFY_CARD_WIDTH - right
  );
  const yPos = Math.max(VIEWPORT_MARGIN, musicTop - CONTROL_GAP - cardHeight);

  return { xPos, yPos };
}

export function Dragspotify({ darkMode = false, open = false }: FocusTrackCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [floating, setFloating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cardWidth, setCardWidth] = useState(SPOTIFY_CARD_WIDTH);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const getCardHeight = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      return Math.max(card.getBoundingClientRect().height, SPOTIFY_EMBED_HEIGHT + CARD_CHROME_HEIGHT);
    }
    return SPOTIFY_EMBED_HEIGHT + CARD_CHROME_HEIGHT;
  }, []);

  const anchorNearMusicButton = useCallback(() => {
    const height = getCardHeight();
    const { xPos, yPos } = getAnchorPosition(height);

    setCardWidth(SPOTIFY_CARD_WIDTH);
    x.set(xPos);
    y.set(yPos);
    setFloating(true);
  }, [getCardHeight, x, y]);
  useEffect(() => {
    if (!open) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      anchorNearMusicButton();
    });

    return () => cancelAnimationFrame(frame);
  }, [open, anchorNearMusicButton]);

  useEffect(() => {
    const card = cardRef.current;
    if (!open || !card || !floating) return;

    const observer = new ResizeObserver(() => {
      const height = card.getBoundingClientRect().height;
      const { yPos } = getAnchorPosition(height);
      if (y.get() > yPos) {
        y.set(yPos);
      }
    });

    observer.observe(card);
    return () => observer.disconnect();
  }, [open, floating, y]);

  useEffect(() => {
    if (!open || !floating) return;

    function clampIntoViewport() {
      const card = cardRef.current;
      if (!card) return;

      const height = card.getBoundingClientRect().height;
      const { xPos, yPos } = getAnchorPosition(height);

      x.set(xPos);
      y.set(yPos);
    }

    window.addEventListener("resize", clampIntoViewport);
    return () => window.removeEventListener("resize", clampIntoViewport);
  }, [open, floating, x, y]);

  const shellClass = darkMode
    ? "border-white/20 bg-white/10 shadow-black/20 backdrop-blur-xl"
    : "border-white/80 bg-white/50 shadow-stone-300/25 backdrop-blur-xl";

  const card = (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={floating ? viewportRef : undefined}
      dragElastic={0.05}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      style={{
        x: floating ? x : 0,
        y: floating ? y : 0,
        width: cardWidth,
        maxWidth: cardWidth,
        position: floating ? "fixed" : "relative",
        zIndex: floating ? FLOAT_Z_INDEX : "auto",
        top: floating ? 0 : undefined,
        left: floating ? 0 : undefined,
        touchAction: "none",
      }}
      className={`w-full max-w-full cursor-grab rounded-2xl border shadow-sm active:cursor-grabbing ${shellClass}`}
    >
      <div
        className={`flex shrink-0 items-center justify-between gap-2 border-b px-2 py-1.5 ${
          darkMode ? "border-white/10 bg-white/6" : "border-white/60 bg-white/35"
        }`}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 text-emerald-500"
          >
            <path
              fill="currentColor"
              d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
            />
          </svg>
          <p
            className={`truncate text-[0.58rem] font-semibold uppercase tracking-[0.16em] ${
              darkMode ? "text-stone-400" : "text-stone-500"
            }`}
          >
            Spotify · Now playing
          </p>
        </div>
        <span
          className={`shrink-0 text-[0.58rem] font-medium uppercase tracking-wide ${
            darkMode ? "text-stone-500" : "text-stone-400"
          }`}
        >
          Idle
        </span>
      </div>

      <div className="w-full max-w-full shrink-0 overflow-hidden pb-1.5 pt-1">
        <div
          className={`w-full max-w-full overflow-hidden rounded-xl ${
            isDragging ? "pointer-events-none" : ""
          }`}
          style={{ minHeight: SPOTIFY_EMBED_HEIGHT }}
        >
          <Spotifydrag />
        </div>
      </div>
    </motion.div>
  );

  if (!open || !floating) {
    return null;
  }

  return createPortal(
    <>
      <div
        ref={viewportRef}
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: FLOAT_Z_INDEX - 1 }}
        aria-hidden="true"
      />
      {card}
    </>,
    document.body,
  );
}
