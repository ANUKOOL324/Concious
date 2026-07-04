import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { runAshqnorChat } from "./api";
import type { AshqnorMessage } from "./types";

const ASHQNOR_GREETING =
  "Ask Ashqnor about your saved videos, articles, Spotify audio, or patterns in your brain.";

interface AshqnorChatProps {
  darkMode: boolean;
}

export function AshqnorChat({ darkMode }: AshqnorChatProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<AshqnorMessage[]>([
    {
      role: "assistant",
      content: ASHQNOR_GREETING,
    },
  ]);

  const chatMutation = useMutation({
    mutationFn: (message: string) => runAshqnorChat(message),
    onSuccess: (result) => {
      setChatMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content: result.response,
          mode: result.mode,
          sources: result.sources,
        },
      ]);
    },
  });

  function handleChatSubmit() {
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage || chatMutation.isPending) {
      return;
    }

    setChatMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: trimmedMessage,
      },
    ]);
    setChatInput("");
    chatMutation.mutate(trimmedMessage);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setChatOpen((isOpen) => !isOpen)}
        className={`fixed right-4 bottom-4 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition hover:shadow-[0_24px_60px_rgba(15,23,42,0.22)] lg:right-5 lg:bottom-auto lg:top-1/2 lg:h-14 lg:w-14 lg:-translate-y-1/2 lg:hover:-translate-y-[52%] ${
          darkMode
            ? "border-white/10 bg-slate-950/95 text-emerald-300"
            : "border-white/80 bg-white/95 text-emerald-700"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7"
        >
          <path d="M4 5.25A2.25 2.25 0 0 1 6.25 3h11.5A2.25 2.25 0 0 1 20 5.25v8.5A2.25 2.25 0 0 1 17.75 16H11.5l-4.53 3.4A.75.75 0 0 1 5.75 18.8V16h-.5A2.25 2.25 0 0 1 3 13.75v-8.5Z" />
        </svg>
      </button>

      {chatOpen && (
        <div
          className={`fixed inset-x-4 bottom-20 z-40 flex h-[min(72vh,38rem)] w-auto flex-col rounded-4xl p-4 shadow-[0_28px_80px_rgba(15,23,42,0.18)] sm:left-auto sm:right-4 sm:w-[24rem] lg:right-24 lg:top-1/2 lg:bottom-auto lg:h-[min(76vh,42rem)] lg:w-[min(92vw,24rem)] lg:-translate-y-1/2 ${
            darkMode
              ? "border border-white/10 bg-[#0f1218]/96"
              : "border border-white/80 bg-white/96"
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 ${
              darkMode
                ? "border-b border-white/10"
                : "border-b border-stone-200"
            }`}
          >
            <div>
              <p
                className={`text-[0.68rem] font-semibold uppercase tracking-[0.28em] ${
                  darkMode ? "text-violet-300" : "text-violet-500"
                }`}
              >
                Ashqnor
              </p>
              <h2
                className={`mt-1 text-lg font-semibold ${
                  darkMode ? "text-stone-100" : "text-stone-900"
                }`}
              >
                Chat with your brain
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className={`cursor-pointer rounded-full p-2 transition ${
                darkMode
                  ? "text-stone-500 hover:bg-white/5 hover:text-stone-200"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6 6 18"
                />
              </svg>
            </button>
          </div>

          <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
            {chatMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? darkMode
                      ? "ml-8 bg-violet-500 text-white"
                      : "ml-8 bg-stone-950 text-white"
                    : darkMode
                      ? "mr-4 border border-white/10 bg-slate-900 text-stone-200"
                      : "mr-4 border border-stone-200 bg-stone-50 text-stone-700"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.sources.slice(0, 3).map((source, sourceIndex) => (
                      <a
                        key={`${source.link ?? source.title ?? sourceIndex}`}
                        href={source.link ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          darkMode
                            ? "bg-white/8 text-violet-200 hover:bg-white/12"
                            : "bg-white text-violet-700 hover:bg-violet-50"
                        }`}
                      >
                        {source.title?.trim() || "Untitled"}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {chatMutation.isPending && (
              <div
                className={`mr-4 rounded-2xl px-4 py-3 text-sm ${
                  darkMode
                    ? "border border-white/10 bg-slate-900 text-stone-400"
                    : "border border-stone-200 bg-stone-50 text-stone-500"
                }`}
              >
                Ashqnor is reading through your saved content...
              </div>
            )}
          </div>

          <div
            className={`mt-4 rounded-2xl p-3 ${
              darkMode
                ? "border border-white/10 bg-slate-950/80"
                : "border border-stone-200 bg-stone-50"
            }`}
          >
            <textarea
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask about videos, articles, playlists, or patterns..."
              className={`min-h-[84px] w-full resize-none bg-transparent text-sm outline-none ${
                darkMode
                  ? "text-stone-100 placeholder:text-stone-500"
                  : "text-stone-900 placeholder:text-stone-400"
              }`}
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p
                className={`text-xs ${
                  darkMode ? "text-stone-400" : "text-stone-500"
                }`}
              >
                {chatMutation.data?.mode === "vector"
                  ? "Vector mode"
                  : "Grounded mode"}
              </p>
              <button
                type="button"
                onClick={handleChatSubmit}
                disabled={chatMutation.isPending}
                className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  darkMode
                    ? "bg-violet-500 hover:bg-violet-400"
                    : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                {chatMutation.isPending ? "Thinking..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
