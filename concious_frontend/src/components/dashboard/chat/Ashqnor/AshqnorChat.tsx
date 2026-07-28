import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CrossIcon } from "../../../../Icon/CrossIcon";
import {
  contentModalCloseButtonClass,
  contentModalOverlayClass,
} from "../../../content/contentModalStyles";
import { runAshqnorChat } from "./api";
import type { AshqnorMessage, AshqnorSource } from "./types";

const ASHQNOR_GREETING =
  "Ask Ashqnor about your saved videos, articles, Spotify audio, or patterns in your brain.";

// Edit panel size/position in this block only. Save the file, then hard-refresh the browser (Ctrl+Shift+R).
const CHAT_PANEL_LAYOUT = {
  shell:
    "fixed z-[120] flex flex-col overflow-hidden rounded-[1.5rem] p-4 shadow-[0_28px_80px_rgba(15,23,42,0.18)]",
  mobile:
    "inset-x-5 bottom-20 h-[min(72dvh,36rem)] w-[min(calc(100vw-2.5rem),27rem)]",
  desktop:
    "sm:left-auto sm:right-3 sm:w-[27rem] lg:right-20 lg:top-[calc(50%+3.5rem)] lg:bottom-auto lg:h-[min(70dvh,38rem)] lg:w-[min(92vw,29rem)] lg:-translate-y-1/2",
} as const;

function getChatErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return "Ashqnor could not respond right now. Please try again.";
  }

  const message = error.response?.data?.message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (!error.response) {
    return "Could not reach the server. Check that the backend is running.";
  }

  return "Ashqnor could not respond right now. Please try again.";
}

function renderSourceCard(
  source: AshqnorSource,
  sourceIndex: number,
  darkMode: boolean
) {
  const title = source.title?.trim() || "Untitled";
  const link = source.link?.trim();
  const type = source.type?.trim();

  return (
    <li
      key={`${source.link ?? source.title ?? sourceIndex}`}
      className={`rounded-xl px-3 py-2.5 ${
        darkMode
          ? "border border-white/8 bg-white/4"
          : "border border-stone-200 bg-white"
      }`}
    >
      <p className="leading-snug">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className={`font-medium underline underline-offset-2 ${
              darkMode
                ? "text-stone-100 hover:text-violet-200"
                : "text-stone-900 hover:text-violet-800"
            }`}
          >
            {title}
          </a>
        ) : (
          <span
            className={`font-medium ${
              darkMode ? "text-stone-100" : "text-stone-900"
            }`}
          >
            {title}
          </span>
        )}
      </p>
      {link ? (
        <p
          className={`mt-1 break-all text-xs leading-5 ${
            darkMode ? "text-stone-500" : "text-stone-400"
          }`}
        >
          {link}
        </p>
      ) : (
        <p
          className={`mt-1 text-xs ${
            darkMode ? "text-stone-500" : "text-stone-400"
          }`}
        >
          No link saved
        </p>
      )}
      {type && (
        <p
          className={`mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${
            darkMode ? "text-stone-500" : "text-stone-400"
          }`}
        >
          {type}
        </p>
      )}
    </li>
  );
}

interface AshqnorChatProps {
  darkMode: boolean;
}

export function AshqnorChat({ darkMode }: AshqnorChatProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
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
          listLabel: result.listLabel,
        },
      ]);
    },
    onError: (error) => {
      setChatMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content: getChatErrorMessage(error),
        },
      ]);
    },
  });

  useEffect(() => {
    if (!chatOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [chatMessages, chatMutation.isPending, chatOpen]);

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
        aria-label={chatOpen ? "Close Ashqnor chat" : "Open Ashqnor chat"}
        aria-expanded={chatOpen}
        className={`fixed right-4 bottom-4 z-[120] flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition hover:shadow-[0_24px_60px_rgba(15,23,42,0.22)] lg:right-5 lg:bottom-auto lg:top-[calc(50%+7rem)] lg:h-14 lg:w-14 lg:-translate-y-1/2 lg:hover:-translate-y-[52%] ${
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
        <>
          <button
            type="button"
            aria-label="Close Ashqnor chat backdrop"
            onClick={() => setChatOpen(false)}
            className={`fixed inset-0 z-[119] ${contentModalOverlayClass(darkMode)}`}
          />
          <div
          className={`${CHAT_PANEL_LAYOUT.shell} ${CHAT_PANEL_LAYOUT.mobile} ${CHAT_PANEL_LAYOUT.desktop} ${
            darkMode
              ? "border border-white/10 bg-slate-950"
              : "border border-stone-200 bg-white"
          }`}
        >
          <div
            className={`flex shrink-0 items-center justify-between pb-3 ${
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
              aria-label="Close Ashqnor chat"
              onClick={() => setChatOpen(false)}
              className={contentModalCloseButtonClass(darkMode)}
            >
              <CrossIcon />
            </button>
          </div>

          <div
            className={`mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-1 ${
              darkMode ? "concious-scrollbar-dark" : "concious-scrollbar-light"
            }`}
          >
            {chatMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? darkMode
                      ? "ml-auto bg-violet-500 text-white"
                      : "ml-auto bg-stone-950 text-white"
                    : darkMode
                      ? "mr-auto border border-white/10 bg-slate-900 text-stone-200"
                      : "mr-auto border border-stone-200 bg-stone-50 text-stone-700"
                }`}
              >
                {(message.mode === "inventory-list" ||
                  message.mode === "content-picker") &&
                message.sources?.length ? (
                  <div>
                    <p className="mb-3 whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p className="font-semibold">
                      {message.listLabel ?? "Saved content"} ({message.sources.length})
                    </p>
                    <ul className="mt-3 space-y-3">
                      {message.sources.map((source, sourceIndex) =>
                        renderSourceCard(source, sourceIndex, darkMode)
                      )}
                    </ul>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    {message.sources?.length === 1 && (
                      <div className="mt-3">
                        <p
                          className={`mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${
                            darkMode ? "text-stone-500" : "text-stone-400"
                          }`}
                        >
                          Source
                        </p>
                        <ul className="space-y-3">
                          {renderSourceCard(message.sources[0]!, 0, darkMode)}
                        </ul>
                      </div>
                    )}
                    {message.sources && message.sources.length > 1 && (
                      <ul className="mt-3 space-y-3">
                        {message.sources.map((source, sourceIndex) =>
                          renderSourceCard(source, sourceIndex, darkMode)
                        )}
                      </ul>
                    )}
                  </>
                )}
              </div>
            ))}

            {chatMutation.isPending && (
              <div
                className={`mr-auto max-w-[92%] rounded-2xl px-4 py-3 text-sm ${
                  darkMode
                    ? "border border-white/10 bg-slate-900 text-stone-400"
                    : "border border-stone-200 bg-stone-50 text-stone-500"
                }`}
              >
                Ashqnore is reading brain ..
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div
            className={`mt-3 shrink-0 rounded-2xl p-2 ${
              darkMode
                ? "border border-white/10 bg-slate-950/80"
                : "border border-stone-200 bg-stone-50"
            }`}
          >
            <div className="flex items-end gap-2">
              <textarea
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleChatSubmit();
                  }
                }}
                rows={1}
                placeholder="Ask about videos, articles, playlists, or patterns..."
                className={`max-h-16 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm leading-5 outline-none ${
                  darkMode
                    ? "text-stone-100 placeholder:text-stone-500"
                    : "text-stone-900 placeholder:text-stone-400"
                }`}
              />
              <button
                type="button"
                onClick={handleChatSubmit}
                disabled={chatMutation.isPending}
                className={`shrink-0 cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
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
        </>
      )}
    </>
  );
}
