import { useState } from "react";
import { Spotifydrag } from "../Embed/Spotifydrag";
import { motion } from "framer-motion";

export function Dragspotify() {
  const [dragEnabled, setDragEnabled] = useState(false);
  return (
    <>
      <motion.div
        drag={dragEnabled}
        dragMomentum={false}
        className="
            w-60
            bg-white
            rounded-xl
            shadow-lg shadow-purple-200/40
            border-2 border-dashed border-l-purple-400/60 border-r-black border-t-purple-400/60
            overflow-hidden
          "
      >
        <div
          onClick={() => setDragEnabled((v) => !v)}
          className={`
              h-10
              flex items-center justify-center
              text-sm font-medium
              text-purple-600
              bg-purple-50
              border-b border-purple-200
              select-none
              ${dragEnabled ? "cursor-grabbing" : "cursor-grab"}
            `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="black"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="black"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
            />
          </svg>
        </div>
        <div className="pointer-events-auto p-2">
          <Spotifydrag />
        </div>
      </motion.div>
    </>
  );
}
