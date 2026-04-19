import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import { PlusIcon } from "../Icon/PlusIcon";
import { Sidebar } from "../components/Sidebar";
import { Backendurl } from "../config";
import { SidebarIcon } from "../Icon/SidebarIcon";
import { Sbutton } from "../components/Sbutton";
import { Sharecard } from "../components/Sharecard";
import { Briansvg } from "../Icon/Brainsvg";
import { logged, logout } from "../HelperFunction/authcheck";
import { Dragspotify } from "../components/Dragspotify";

interface Content {
  _id: string;
  title: string;
  link: string;
  type: "Youtube" | "Twitter" | "Spotify" | "Other";
}

interface SearchResult {
  _id?: string;
  title?: string | null;
  link?: string | null;
  type?: string | null;
  similarity?: number;
}

interface SearchResponse {
  query: string;
  count: number;
  mode: "vector" | "lexical-fallback";
  results: SearchResult[];
}

interface ChatSource {
  title?: string | null;
  link?: string | null;
  type?: string | null;
  similarity?: number;
}

interface ChatResponse {
  mode: "vector" | "lexical-fallback";
  response: string;
  sources: ChatSource[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  mode?: "vector" | "lexical-fallback";
  sources?: ChatSource[];
}

type FilterType = "ALL" | "Twitter" | "Youtube" | "Spotify";

function authHeaders() {
  return {
    authorization: localStorage.getItem("Token"),
  };
}

async function fetchData() {
  const res = await axios.get(`${Backendurl}/api/v1/content`, {
    headers: authHeaders(),
  });
  return res.data.content;
}

async function runSemanticSearch(query: string) {
  const res = await axios.post<SearchResponse>(
    `${Backendurl}/api/v1/search`,
    { query, limit: 6 },
    { headers: authHeaders() }
  );
  return res.data;
}

async function runChat(message: string) {
  const res = await axios.post<ChatResponse>(
    `${Backendurl}/api/v1/chat`,
    { message },
    { headers: authHeaders() }
  );
  return res.data;
}

function Dashboard() {
  const initialDesktop =
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true;
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [isDesktop, setIsDesktop] = useState(initialDesktop);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("dashboard-theme");
    return savedTheme === "dark";
  });
  const [mopen, setmOpen] = useState(false);
  const [sopen, setsOpen] = useState(initialDesktop);
  const [scopen, scopenSet] = useState(false);
  const [login, setlogin] = useState(logged());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Ask Ashqnor about your saved videos, articles, Spotify audio, or patterns in your brain.",
    },
  ]);

  const { data, isLoading, error } = useQuery<Content[]>({
    queryKey: ["content"],
    queryFn: fetchData,
  });

  const searchMutation = useMutation({
    mutationFn: runSemanticSearch,
  });

  const chatMutation = useMutation({
    mutationFn: runChat,
    onSuccess: (result) => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.response,
          mode: result.mode,
          sources: result.sources,
        },
      ]);
    },
  });

  const navigate = useNavigate();

  const filteredData = data?.filter((item) => {
    if (filter === "ALL") return true;
    return item.type === filter;
  });

  function handllogout() {
    logout();
    setlogin(false);
    navigate("/");
  }

  function handleSearchSubmit() {
    const trimmed = searchQuery.trim();
    if (!trimmed || searchMutation.isPending) return;
    searchMutation.mutate(trimmed);
  }

  useEffect(() => {
    if (!searchOpen) return;

    const trimmed = searchQuery.trim();

    if (!trimmed) {
      searchMutation.reset();
      return;
    }

    const timer = window.setTimeout(() => {
      searchMutation.mutate(trimmed);
    }, 220);

    return () => window.clearTimeout(timer);
  }, [searchOpen, searchQuery]);

  useEffect(() => {
    localStorage.setItem("dashboard-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setsOpen(true);
      } else {
        setsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleChatSubmit() {
    const trimmed = chatInput.trim();
    if (!trimmed || chatMutation.isPending) return;

    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: trimmed,
      },
    ]);
    setChatInput("");
    chatMutation.mutate(trimmed);
  }

  return (
    <div
      className={`h-dvh overflow-hidden ${
        darkMode
          ? "bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.18),transparent_24%),linear-gradient(180deg,#090a0f_0%,#0c0e14_42%,#11131a_100%)]"
          : "bg-[radial-gradient(circle_at_top,rgba(141,128,188,0.15),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8f8fb_45%,#f3f4f6_100%)]"
      }`}
    >
      <div
        className={`pointer-events-none fixed inset-0 [background-size:28px_28px] ${
          darkMode
            ? "opacity-[0.1] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]"
            : "opacity-[0.08] [background-image:linear-gradient(rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px)]"
        }`}
      />

      <CreateContentModal
        open={mopen}
        darkMode={darkMode}
        onClose={() => {
          setmOpen(false);
        }}
      />

      {searchOpen && (
        <div className="fixed inset-0 z-40 bg-black/18 backdrop-blur-[2px]">
          <div
            className={`mx-auto mt-4 w-[min(94vw,44rem)] rounded-[1.8rem] p-3 shadow-[0_28px_80px_rgba(15,23,42,0.16)] lg:mt-5 ${
              darkMode
                ? "border border-white/10 bg-[#0f1218]/96"
                : "border border-white/80 bg-white/96"
            }`}
          >
            <div
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 shadow-sm ${
                darkMode
                  ? "border border-white/10 bg-slate-950/90"
                  : "border border-stone-200 bg-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5 text-stone-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit();
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                placeholder="Search your brain semantically..."
                className={`min-w-0 flex-1 bg-transparent text-base outline-none ${
                  darkMode
                    ? "text-stone-100 placeholder:text-stone-500"
                    : "text-stone-900 placeholder:text-stone-400"
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
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

            <div
              className={`mt-3 max-h-[60vh] overflow-y-auto rounded-2xl ${
                darkMode
                  ? "border border-white/10 bg-slate-950/80"
                  : "border border-stone-200 bg-white"
              }`}
            >
              {searchMutation.isPending && (
                <p
                  className={`px-5 py-4 text-sm ${
                    darkMode ? "text-stone-400" : "text-stone-500"
                  }`}
                >
                  Searching your saved content...
                </p>
              )}

              {!searchMutation.isPending &&
                !searchMutation.data?.results?.length && (
                  <p
                    className={`px-5 py-4 text-sm ${
                      darkMode ? "text-stone-400" : "text-stone-500"
                    }`}
                  >
                    Search suggestions will appear here as ranked results.
                  </p>
                )}

              {searchMutation.data?.results?.map((result, index) => (
                <a
                  key={`${result._id ?? result.link ?? index}`}
                  href={result.link ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-start gap-3 px-5 py-4 transition last:border-b-0 ${
                    darkMode
                      ? "border-b border-white/6 hover:bg-white/5"
                      : "border-b border-stone-100 hover:bg-stone-50"
                  }`}
                >
                  <span
                    className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full ${
                      darkMode
                        ? "bg-white/8 text-stone-300"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-semibold ${
                        darkMode ? "text-stone-100" : "text-stone-900"
                      }`}
                    >
                      {result.title?.trim() || "Untitled content"}
                    </p>
                    <p
                      className={`mt-1 text-xs ${
                        darkMode ? "text-stone-400" : "text-stone-500"
                      }`}
                    >
                      {result.type || "Unknown"} •{" "}
                      {typeof result.similarity === "number"
                        ? `${(result.similarity * 100).toFixed(1)}% match`
                        : "ranked result"}
                    </p>
                    {result.link && (
                      <p
                        className={`mt-1 truncate text-xs ${
                          darkMode ? "text-violet-300" : "text-violet-600"
                        }`}
                      >
                        {result.link}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setChatOpen((prev) => !prev)}
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
          className={`fixed inset-x-4 bottom-20 z-40 flex h-[min(72vh,38rem)] w-auto flex-col rounded-[1.8rem] p-4 shadow-[0_28px_80px_rgba(15,23,42,0.18)] sm:left-auto sm:right-4 sm:w-[24rem] lg:right-24 lg:top-1/2 lg:bottom-auto lg:h-[min(76vh,42rem)] lg:w-[min(92vw,24rem)] lg:-translate-y-1/2 ${
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
                {message.sources?.length ? (
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
                ) : null}
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
              onChange={(e) => setChatInput(e.target.value)}
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

      {!isDesktop && sopen && (
        <div className="fixed inset-0 z-[140] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setsOpen(false)}
            className="absolute inset-0 bg-black/32 backdrop-blur-[3px]"
          />
          <div
            className={`relative ml-auto flex h-full w-[min(20rem,88vw)] flex-col border-l px-4 py-4 shadow-[0_30px_100px_rgba(15,23,42,0.34)] backdrop-blur-xl ${
              darkMode
                ? "border-white/10 bg-[#0d1017]/98"
                : "border-white/80 bg-white/98"
            }`}
          >
            <div
              className={`mb-4 flex items-center justify-between border-b pb-4 ${
                darkMode ? "border-white/10" : "border-black/5"
              }`}
            >
              <div
                onClick={() => {
                  navigate("/");
                  setsOpen(false);
                }}
                className="flex cursor-pointer select-none items-center gap-2"
              >
                <Briansvg darkMode={darkMode} />
                <div className="flex text-3xl">
                  <span className={darkMode ? "text-stone-100" : "text-black"}>
                    Conc
                  </span>
                  <span style={{ color: "#8d80bc" }}>ious</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setsOpen(false)}
                className={`cursor-pointer rounded-full p-2 transition ${
                  darkMode
                    ? "text-stone-400 hover:bg-white/8 hover:text-stone-100"
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

            <div className="min-h-0 flex-1 overflow-y-auto">
              <Sidebar onSelect={setFilter} darkMode={darkMode} />

              <div
                className={`mt-4 space-y-2 rounded-[1.35rem] border p-2 ${
                  darkMode
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-stone-200 bg-stone-50/90"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setDarkMode((prev) => !prev)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${
                    darkMode
                      ? "bg-slate-900 text-stone-100 hover:bg-slate-800"
                      : "bg-white text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <span>{darkMode ? "Light" : "Dark"}</span>
                  {darkMode ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-amber-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v1.5M12 19.5V21M4.5 12H3m18 0h-1.5M6.343 6.343 5.28 5.28m13.44 13.44-1.062-1.063M6.343 17.657 5.28 18.72m13.44-13.44-1.062 1.063M15.75 12A3.75 3.75 0 1 1 8.25 12a3.75 3.75 0 0 1 7.5 0Z"
                      />
                    </svg>
                  ) : (
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
                        d="M21 12.79A9 9 0 1 1 11.21 3a7.5 7.5 0 0 0 9.79 9.79Z"
                      />
                    </svg>
                  )}
                </button>

                {login && (
                  <button
                    type="button"
                    onClick={() => {
                      setsOpen(false);
                      handllogout();
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${
                      darkMode
                        ? "bg-slate-900 text-stone-100 hover:bg-slate-800"
                        : "bg-white text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span>Logout</span>
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
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0 3-3m0 0 3 3m-3-3H9"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-full min-h-0 flex-col lg:flex-row">
        <div
          className={`relative shrink-0 border-b backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-72 lg:min-h-0 lg:flex-col lg:border-r lg:border-b-0 lg:overflow-hidden ${
            darkMode
              ? "border-white/8 bg-[#0b0d12]/88"
              : "border-white/60 bg-white/60"
          }`}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block lg:px-0 lg:py-0">
            <div
              onClick={() => navigate("/")}
              className="flex cursor-pointer select-none items-center gap-2 lg:ml-5 lg:px-0 lg:pt-4"
            >
              <Briansvg darkMode={darkMode} />
              <div className="flex text-[2rem] sm:text-3xl">
                <span className={darkMode ? "text-stone-100" : "text-black"}>
                  Conc
                </span>
                <span style={{ color: "#8d80bc" }}>ious</span>
              </div>
            </div>

            <div className="lg:hidden">
              <Sbutton
                onClose={() => {
                  setsOpen((c) => !c);
                }}
                soundSrc="src/assets/mixkit-retro-game-notification-212.wav"
                css={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 ${
                  darkMode
                    ? "border-white/10 bg-slate-900 text-stone-100 hover:bg-slate-800"
                    : "border-gray-200 bg-gray-100 hover:bg-gray-50"
                }`}
                StartIcon={<SidebarIcon />}
              />
            </div>
          </div>

          <div className="hidden flex-col gap-4 px-4 pb-4 lg:mt-3 lg:flex lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-3 lg:pb-4">
            <div className="lg:ml-2">
              <Sbutton
                onClose={() => {
                  setsOpen((c) => !c);
                }}
                soundSrc="src/assets/mixkit-retro-game-notification-212.wav"
                css={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 ${
                  darkMode
                    ? "border-white/10 bg-slate-900 text-stone-100 hover:bg-slate-800"
                    : "border-gray-200 bg-gray-100 hover:bg-gray-50"
                }`}
                StartIcon={<SidebarIcon />}
              />
            </div>

            {sopen && <Sidebar onSelect={setFilter} darkMode={darkMode} />}

            <div className="flex items-center justify-center">
              <Dragspotify darkMode={darkMode} />
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-4 py-3 lg:px-5 lg:py-4">
          <CreateContentModal
            open={mopen}
            darkMode={darkMode}
            onClose={() => {
              setmOpen(false);
            }}
          />

          <div
            className={`z-30 rounded-[2rem] px-4 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-5 ${
              darkMode
                ? "border border-white/10 bg-[#10131b]/92"
                : "border border-white/80 bg-white/90"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p
                  className={`text-[0.7rem] font-semibold uppercase tracking-[0.34em] ${
                    darkMode ? "text-violet-300" : "text-violet-500"
                  }`}
                >
                  Dashboard
                </p>
                <h1
                  className={`mt-1 text-[1.7rem] font-semibold tracking-tight sm:text-[2rem] ${
                    darkMode ? "text-stone-100" : "text-stone-950"
                  }`}
                >
                  Your saved thinking space
                </h1>
              </div>

              <div className="relative grid w-full grid-cols-2 gap-3 lg:flex lg:w-auto lg:flex-wrap lg:items-center lg:justify-end lg:gap-3">
                <button
                  type="button"
                  onClick={() => setDarkMode((prev) => !prev)}
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                  className={`hidden h-12 w-full cursor-pointer items-center justify-center rounded-2xl transition lg:flex lg:w-12 ${
                    darkMode
                      ? "border border-white/10 bg-slate-900 text-amber-300 hover:bg-slate-800"
                      : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  {darkMode ? (
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
                        d="M12 3v1.5M12 19.5V21M4.5 12H3m18 0h-1.5M6.343 6.343 5.28 5.28m13.44 13.44-1.062-1.063M6.343 17.657 5.28 18.72m13.44-13.44-1.062 1.063M15.75 12A3.75 3.75 0 1 1 8.25 12a3.75 3.75 0 0 1 7.5 0Z"
                      />
                    </svg>
                  ) : (
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
                        d="M21 12.79A9 9 0 1 1 11.21 3a7.5 7.5 0 0 0 9.79 9.79Z"
                      />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className={`col-span-2 flex h-12 w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-sm transition lg:col-span-1 lg:min-w-[14rem] lg:flex-1 lg:w-auto lg:flex-none ${
                    darkMode
                      ? "border border-white/10 bg-slate-900 text-stone-400 hover:border-violet-400/30 hover:bg-slate-800"
                      : "border border-stone-200 bg-white text-stone-500 hover:border-violet-200 hover:bg-violet-50/60"
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
                      d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span>Search semantically...</span>
                </button>

                <Button
                  variety="Primary"
                  text="Add Content"
                  StartIcon={<PlusIcon />}
                  onClose={() => {
                    setmOpen(true);
                  }}
                  soundSrc="src/assets/mixkit-retro-game-notification-212.wav"
                  className={`col-span-1 h-12 w-full lg:!h-12 lg:!min-w-[9.25rem] lg:w-auto ${
                    darkMode
                      ? "!bg-white !text-stone-950 hover:!bg-stone-200 !shadow-black/20"
                      : ""
                  }`}
                />
                <Button
                  variety="Secondary"
                  text="Share Brain"
                  onClose={() => {
                    scopenSet((c) => !c);
                  }}
                  className={`col-span-1 h-12 w-full lg:!h-12 lg:!min-w-[9.25rem] lg:w-auto ${
                    darkMode
                      ? "!border-white/10 !bg-violet-500/14 !text-violet-100 hover:!bg-violet-500/24 !shadow-black/20"
                      : ""
                  }`}
                />
                {login && (
                  <Button
                    variety="Primary"
                    text="Logout"
                    onClose={() => {
                      handllogout();
                    }}
                    className={`col-span-1 hidden w-full lg:!inline-flex lg:!h-12 lg:!min-w-[9.25rem] lg:w-auto ${
                      darkMode
                        ? "!bg-slate-900 !text-stone-100 hover:!bg-slate-800 !shadow-black/20"
                        : ""
                    }`}
                  />
                )}
                {scopen && <Sharecard darkMode={darkMode} />}
              </div>
            </div>
          </div>

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] sm:gap-8">
              {isLoading && <p>Loading...</p>}
              {error && <p>Something went wrong</p>}
              {filteredData?.map((item) => (
                <Card
                  key={item._id}
                  _id={item._id}
                  title={item.title}
                  link={item.link}
                  type={item.type}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
