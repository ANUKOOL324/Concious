import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BsFileEarmarkPdf, BsThreeDotsVertical } from "react-icons/bs";
import { LuLayers, LuNewspaper } from "react-icons/lu";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TwitterIcon } from "../../Icon/TwitterIcon";
import { ShareIcon } from "../../Icon/ShareIcon";
import { Sbutton } from "../common/Sbutton";
import { Backendurl } from "../../config";
import { SpotifyIcon } from "../../Icon/SpotifyIcon";
import { YoutubecardIcon } from "../../Icon/YotubecardIcon";
import { Trashicon } from "../../Icon/Trashicon";
import { CrossIcon } from "../../Icon/CrossIcon";
import {
  CONTENT_MODAL_SHELL_CLASS,
  contentModalAdvancedSectionClass,
  contentModalAiMemorySectionClass,
  contentModalCloseButtonClass,
  contentModalFieldClass,
  contentModalFooterClass,
  contentModalHeaderClass,
  contentModalLabelClass,
  contentModalOverlayClass,
  contentModalPanelClass,
  contentModalPrimaryButtonClass,
  contentModalScrollClass,
  contentModalSecondaryButtonClass,
  contentModalSectionLabelClass,
} from "./contentModalStyles";
import { ImportanceSelect } from "./ImportanceSelect";
import {
  mapContentFromApi,
  type Content,
  type Importance,
} from "../../types/content";

interface CardProps extends Content {
  darkMode?: boolean;
  readOnly?: boolean;
}

interface UpdateContentArgs {
  id: string;
  title: string;
  personalNote?: string;
  summary?: string;
  tags: string[];
  collection?: string;
  whySaved?: string;
  importance: Importance;
}

function getYouTubeEmbedUrl(link: string): string | null {
  try {
    const url = new URL(link);

    if (url.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${url.pathname}`;
    }

    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function getSpotifyEmbedUrl(link: string): string | null {
  try {
    const url = new URL(link);

    if (url.hostname.includes("open.spotify.com")) {
      return `https://open.spotify.com/embed${url.pathname}`;
    }

    return null;
  } catch {
    return null;
  }
}

function getHostname(link: string): string | null {
  try {
    const url = new URL(link);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function getLinkedInEmbedUrl(link: string): string | null {
  try {
    const url = new URL(link);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host !== "linkedin.com") {
      return null;
    }

    const decodedLink = decodeURIComponent(link);
    const pathname = decodeURIComponent(url.pathname);

    const explicitUrn = decodedLink.match(
      /urn:li:(ugcPost|activity|share):(\d+)/i
    );
    if (explicitUrn) {
      const urnType = explicitUrn[1].toLowerCase();
      const normalizedType =
        urnType === "ugcpost"
          ? "ugcPost"
          : urnType === "activity"
            ? "activity"
            : "share";

      return `https://www.linkedin.com/embed/feed/update/urn:li:${normalizedType}:${explicitUrn[2]}`;
    }

    const isPostPath =
      pathname.includes("/posts/") || pathname.includes("/feed/update/");
    if (!isPostPath) {
      return null;
    }

    const ugcPostId = decodedLink.match(/ugcPost[-_](\d+)/i)?.[1];
    if (ugcPostId) {
      return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${ugcPostId}`;
    }

    const activityId = decodedLink.match(/activity[-_](\d+)/i)?.[1];
    if (activityId) {
      return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${activityId}`;
    }

    return null;
  } catch {
    return null;
  }
}

function trimToLimit(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength) || undefined;
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10);
}

async function updateContent({ id, ...payload }: UpdateContentArgs) {
  const res = await axios.patch(`${Backendurl}/api/v1/content/${id}`, payload, {
    headers: {
      authorization: localStorage.getItem("Token"),
    },
  });

  return mapContentFromApi(res.data as Record<string, unknown>);
}

async function deleteContent(id: string) {
  await axios.delete(`${Backendurl}/api/v1/content/${id}`, {
    headers: {
      authorization: localStorage.getItem("Token"),
    },
  });
}

export function Card({
  _id,
  title,
  link,
  type,
  personalNote,
  summary,
  tags = [],
  collection,
  whySaved,
  importance = "medium",
  fileMetadata,
  darkMode = false,
  readOnly = false,
}: CardProps) {
  const embedUrl = type === "Youtube" ? getYouTubeEmbedUrl(link) : null;
  const spotifyEmbedUrl = type === "Spotify" ? getSpotifyEmbedUrl(link) : null;
  const linkedInEmbedUrl = type === "Other" ? getLinkedInEmbedUrl(link) : null;
  const articleHost =
    type === "Other" || type === "Article" ? getHostname(link) : null;
  const pdfUrl = fileMetadata?.secureUrl ?? link;
  const pdfFilename = fileMetadata?.originalFilename ?? title;
  const pdfPreviewFetchUrl = readOnly
    ? pdfUrl
    : `${Backendurl}/api/v1/content/${_id}/pdf`;
  const documentIconWrap = darkMode
    ? "bg-white/8 text-stone-300 ring-1 ring-white/10"
    : "bg-stone-100 text-stone-600 ring-1 ring-stone-200/80";

  const typeIcon =
    type === "Spotify" ? (
      <SpotifyIcon />
    ) : type === "Twitter" ? (
      <TwitterIcon color={darkMode ? "#f5f5f4" : "#111827"} />
    ) : type === "Youtube" ? (
      <YoutubecardIcon />
    ) : type === "PDF" ? (
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${documentIconWrap}`}
      >
        <BsFileEarmarkPdf size={18} aria-hidden />
      </span>
    ) : type === "Article" ? (
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${documentIconWrap}`}
      >
        <LuNewspaper size={18} aria-hidden />
      </span>
    ) : (
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${documentIconWrap}`}
      >
        <LuLayers size={18} aria-hidden />
      </span>
    );

  const [editing, setEditing] = useState(false);
  const [renamingTitle, setRenamingTitle] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [pdfObjectUrl, setPdfObjectUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [quickTitle, setQuickTitle] = useState(title);
  const [newTitle, setNewTitle] = useState(title);
  const [newPersonalNote, setNewPersonalNote] = useState(personalNote ?? "");
  const [newSummary, setNewSummary] = useState(summary ?? "");
  const [newTags, setNewTags] = useState(tags.join(", "));
  const [newCollection, setNewCollection] = useState(collection ?? "");
  const [newWhySaved, setNewWhySaved] = useState(whySaved ?? "");
  const [newImportance, setNewImportance] = useState<Importance>(importance);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const skipRenameSaveRef = useRef(false);
  const actionMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const actionMenuPanelRef = useRef<HTMLDivElement>(null);
  const [actionMenuPosition, setActionMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const portalReady = typeof document !== "undefined";

  const queryClient = useQueryClient();

  function updateActionMenuPosition() {
    const trigger = actionMenuTriggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    setActionMenuPosition({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });
  }

  useLayoutEffect(() => {
    if (!actionMenuOpen) {
      return;
    }

    updateActionMenuPosition();
  }, [actionMenuOpen]);

  useEffect(() => {
    if (!actionMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        actionMenuTriggerRef.current?.contains(target) ||
        actionMenuPanelRef.current?.contains(target)
      ) {
        return;
      }
      setActionMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActionMenuOpen(false);
      }
    }

    function handleReposition() {
      updateActionMenuPosition();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [actionMenuOpen]);

  useEffect(() => {
    if (!editing && !pdfViewerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [editing, pdfViewerOpen]);

  async function openPdfViewer() {
    if (!pdfPreviewFetchUrl) {
      toast.error("PDF file is unavailable");
      return;
    }

    if (pdfLoading) {
      return;
    }

    setPdfLoading(true);

    try {
      const headers: Record<string, string> = {};
      if (!readOnly) {
        const token = localStorage.getItem("Token");
        if (token) {
          headers.authorization = token;
        }
      }

      const response = await fetch(pdfPreviewFetchUrl, { headers });
      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }

      const blob = await response.blob();
      const pdfBlob =
        blob.type === "application/pdf"
          ? blob
          : new Blob([blob], { type: "application/pdf" });

      setPdfObjectUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
        return URL.createObjectURL(pdfBlob);
      });
      setPdfViewerOpen(true);
    } catch {
      toast.error("Could not load PDF preview");
    } finally {
      setPdfLoading(false);
    }
  }

  function closePdfViewer() {
    setPdfViewerOpen(false);
    setPdfObjectUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return null;
    });
  }

  const mutation = useMutation<Content, Error, UpdateContentArgs>({
    mutationFn: updateContent,
    onSuccess: (updatedContent) => {
      queryClient.setQueryData<Content[]>(["content"], (old = []) =>
        old.map((item) =>
          item._id === updatedContent._id ? updatedContent : item
        )
      );
      toast.success("Content updated!");
      setEditing(false);
      setRenamingTitle(false);
      setActionMenuOpen(false);
    },
    onError: () => {
      toast.error("Failed to update content");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success("Content deleted");
    },
    onError: () => {
      toast.error("Failed to delete content");
    },
  });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  function startTitleRename() {
    skipRenameSaveRef.current = false;
    setQuickTitle(title);
    setRenamingTitle(true);
    setActionMenuOpen(false);
  }

  function cancelTitleRename() {
    setQuickTitle(title);
    setRenamingTitle(false);
  }

  function saveTitleOnly() {
    const trimmedTitle = quickTitle.trim();
    if (!trimmedTitle) {
      toast.error("Title is required");
      setQuickTitle(title);
      return;
    }

    if (trimmedTitle === title) {
      setRenamingTitle(false);
      return;
    }

    mutation.mutate({
      id: _id,
      title: trimmedTitle,
      personalNote: trimToLimit(personalNote ?? "", 1000),
      summary: trimToLimit(summary ?? "", 1000),
      tags,
      collection: trimToLimit(collection ?? "", 80),
      whySaved: trimToLimit(whySaved ?? "", 500),
      importance,
    });
  }

  function openEditor() {
    setActionMenuOpen(false);
    setRenamingTitle(false);
    setNewTitle(title);
    setNewPersonalNote(personalNote ?? "");
    setNewSummary(summary ?? "");
    setNewTags(tags.join(", "));
    setNewCollection(collection ?? "");
    setNewWhySaved(whySaved ?? "");
    setNewImportance(importance);
    setShowAdvanced(false);
    setEditing(true);
  }

  function saveContent() {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      toast.error("Title is required");
      return;
    }

    mutation.mutate({
      id: _id,
      title: trimmedTitle,
      personalNote: trimToLimit(newPersonalNote, 1000),
      summary: trimToLimit(newSummary, 1000),
      tags: parseTags(newTags),
      collection: trimToLimit(newCollection, 80),
      whySaved: trimToLimit(newWhySaved, 500),
      importance: newImportance,
    });
  }

  const fieldIdPrefix = `edit-content-${_id}`;
  const mediaFrameClass = `aspect-video w-full overflow-hidden rounded-xl border ${
    darkMode ? "border-white/10 bg-slate-900/70" : "border-stone-200 bg-stone-50"
  }`;

  const editFieldClass = contentModalFieldClass(darkMode);
  const editLabelClass = contentModalLabelClass(darkMode);
  const editSectionLabelClass = contentModalSectionLabelClass(darkMode);
  const editPanelClass = contentModalPanelClass(darkMode);

  const modalOverlayClass = contentModalOverlayClass(darkMode);

  const editModal =
    !readOnly && editing && portalReady
      ? createPortal(
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-6">
            <button
              type="button"
              aria-label="Close editor"
              onClick={() => setEditing(false)}
              className={`absolute inset-0 ${modalOverlayClass}`}
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${fieldIdPrefix}-title-heading`}
              className={`${CONTENT_MODAL_SHELL_CLASS} ${editPanelClass}`}
            >
              <div className={contentModalHeaderClass(darkMode)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p
                      className={`text-[0.68rem] font-semibold uppercase tracking-[0.28em] ${
                        darkMode ? "text-violet-300" : "text-violet-500"
                      }`}
                    >
                      Edit content
                    </p>
                    <h2
                      id={`${fieldIdPrefix}-title-heading`}
                      className="mt-1 truncate text-xl font-semibold tracking-tight sm:text-[1.35rem]"
                    >
                      {title || "Untitled content"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    aria-label="Close editor"
                    className={contentModalCloseButtonClass(darkMode)}
                    onClick={() => setEditing(false)}
                  >
                    <CrossIcon />
                  </button>
                </div>
              </div>

              <div
                className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 ${contentModalScrollClass(darkMode)}`}
              >
                <div className="space-y-5">
                  <section>
                    <div className="space-y-4">
                      <div>
                        <label
                          className={editLabelClass}
                          htmlFor={`${fieldIdPrefix}-title`}
                        >
                          Title
                        </label>
                        <input
                          id={`${fieldIdPrefix}-title`}
                          value={newTitle}
                          onChange={(event) => setNewTitle(event.target.value)}
                          placeholder="Give this a clear title"
                          className={editFieldClass}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            className={editLabelClass}
                            htmlFor={`${fieldIdPrefix}-collection`}
                          >
                            Collection
                          </label>
                          <input
                            id={`${fieldIdPrefix}-collection`}
                            value={newCollection}
                            onChange={(event) =>
                              setNewCollection(event.target.value)
                            }
                            maxLength={80}
                            placeholder="Collection name"
                            className={editFieldClass}
                          />
                        </div>

                        <div>
                          <label
                            className={editLabelClass}
                            htmlFor={`${fieldIdPrefix}-importance`}
                          >
                            Importance
                          </label>
                          <ImportanceSelect
                            id={`${fieldIdPrefix}-importance`}
                            value={newImportance}
                            onChange={setNewImportance}
                            darkMode={darkMode}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className={editLabelClass}
                          htmlFor={`${fieldIdPrefix}-tags`}
                        >
                          Tags
                        </label>
                        <input
                          id={`${fieldIdPrefix}-tags`}
                          value={newTags}
                          onChange={(event) => setNewTags(event.target.value)}
                          placeholder="Tags: ai, focus, habits"
                          className={editFieldClass}
                        />
                      </div>
                    </div>
                  </section>

                  <div className={contentModalAiMemorySectionClass(darkMode)}>
                    <p
                      className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${
                        darkMode ? "text-violet-300/90" : "text-violet-600"
                      }`}
                    >
                      AI memory
                    </p>
                    <label
                      className={`${editSectionLabelClass} mb-1 block normal-case tracking-normal`}
                      htmlFor={`${fieldIdPrefix}-why`}
                    >
                      What should Ashqnor remember this for?
                    </label>
                    <p
                      className={`mb-3 text-xs leading-relaxed ${
                        darkMode ? "text-stone-400" : "text-stone-500"
                      }`}
                    >
                      Better context helps semantic search and Ashqnor answer more accurately.
                    </p>
                    <textarea
                      id={`${fieldIdPrefix}-why`}
                      value={newWhySaved}
                      onChange={(event) => setNewWhySaved(event.target.value)}
                      maxLength={500}
                      placeholder="Example: Use this when I ask about RAG, vector search, or reducing hallucinations."
                      className={`${editFieldClass} min-h-[88px] resize-none`}
                    />
                  </div>

                  <div className={contentModalAdvancedSectionClass(darkMode)}>
                    <button
                      type="button"
                      onClick={() => setShowAdvanced((current) => !current)}
                      className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm font-semibold ${
                        darkMode ? "text-stone-200" : "text-stone-800"
                      }`}
                    >
                      <span>Advanced context</span>
                      <span className="text-xs font-medium opacity-70">
                        {showAdvanced ? "Hide" : "Show"}
                      </span>
                    </button>

                    {showAdvanced && (
                      <div className="space-y-3 border-t px-4 py-4">
                        <div>
                          <label
                            className={editLabelClass}
                            htmlFor={`${fieldIdPrefix}-note`}
                          >
                            Personal note
                          </label>
                          <textarea
                            id={`${fieldIdPrefix}-note`}
                            value={newPersonalNote}
                            onChange={(event) =>
                              setNewPersonalNote(event.target.value)
                            }
                            maxLength={1000}
                            placeholder="Your private note about this item"
                            className={`${editFieldClass} min-h-[72px] resize-none`}
                          />
                        </div>

                        <div>
                          <label
                            className={editLabelClass}
                            htmlFor={`${fieldIdPrefix}-summary`}
                          >
                            Summary
                          </label>
                          <textarea
                            id={`${fieldIdPrefix}-summary`}
                            value={newSummary}
                            onChange={(event) => setNewSummary(event.target.value)}
                            maxLength={1000}
                            placeholder="Short summary in your own words"
                            className={`${editFieldClass} min-h-[72px] resize-none`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={contentModalFooterClass(darkMode)}>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className={`w-full ${contentModalSecondaryButtonClass(darkMode)}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveContent}
                    disabled={mutation.isPending}
                    className={`w-full ${contentModalPrimaryButtonClass(darkMode)}`}
                  >
                    {mutation.isPending ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  const actionMenu =
    !readOnly && actionMenuOpen && actionMenuPosition && portalReady
      ? createPortal(
          <div
            ref={actionMenuPanelRef}
            style={{
              top: actionMenuPosition.top,
              right: actionMenuPosition.right,
            }}
            className={`fixed z-[60] min-w-[5.25rem] overflow-hidden rounded-xl border p-1 shadow-[0_18px_45px_rgba(15,23,42,0.18)] ${
              darkMode
                ? "border-white/10 bg-slate-950 text-stone-100"
                : "border-stone-200 bg-white text-stone-900"
            }`}
          >
            <button
              type="button"
              onClick={openEditor}
              className={`flex w-full cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                darkMode ? "hover:bg-white/8" : "hover:bg-stone-100"
              }`}
            >
              Edit
            </button>
          </div>,
          document.body
        )
      : null;

  const pdfModal =
    type === "PDF" && pdfViewerOpen && pdfObjectUrl && portalReady
      ? createPortal(
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-2 sm:p-4">
            <button
              type="button"
              aria-label="Close PDF viewer"
              onClick={closePdfViewer}
              className={`absolute inset-0 ${contentModalOverlayClass(darkMode)}`}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`pdf-viewer-title-${_id}`}
              className={`${CONTENT_MODAL_SHELL_CLASS} ${contentModalPanelClass(darkMode)} !max-h-[94vh] !max-w-[min(94vw,1080px)]`}
            >
              <div className={`${contentModalHeaderClass(darkMode)} px-5 py-3 sm:px-6`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={`text-[0.68rem] font-semibold uppercase tracking-[0.28em] ${
                        darkMode ? "text-violet-300" : "text-violet-500"
                      }`}
                    >
                      PDF preview
                    </p>
                    <h2
                      id={`pdf-viewer-title-${_id}`}
                      className="mt-0.5 truncate text-base font-semibold sm:text-lg"
                    >
                      {pdfFilename?.trim() || title || "Untitled PDF"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    aria-label="Close PDF viewer"
                    className={contentModalCloseButtonClass(darkMode)}
                    onClick={closePdfViewer}
                  >
                    <CrossIcon />
                  </button>
                </div>
              </div>

              <div
                className={`relative min-h-0 flex-1 px-4 py-1.5 sm:px-5 sm:py-2 ${
                  darkMode ? "bg-stone-900/80" : "bg-stone-100"
                }`}
              >
                <div
                  className={`h-full min-h-[68vh] overflow-hidden rounded-xl shadow-sm ${
                    darkMode
                      ? "bg-stone-950 ring-1 ring-white/10"
                      : "bg-white ring-1 ring-stone-200/80"
                  }`}
                >
                  <embed
                    src={pdfObjectUrl}
                    type="application/pdf"
                    title={pdfFilename || title}
                    className="h-full min-h-[68vh] w-full border-0"
                  />
                </div>
              </div>

              <div
                className={`${contentModalFooterClass(darkMode)} flex justify-end px-5 py-2 sm:px-6`}
              >
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${contentModalSecondaryButtonClass(darkMode)} inline-flex !h-9 !w-auto min-w-[10rem] items-center justify-center px-5 no-underline`}
                >
                  Open in new tab
                </a>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div
      className={`min-h-[260px] w-full rounded-[1.6rem] border p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.12)] ${
        darkMode
          ? "border-white/8 bg-slate-950/76 text-stone-100"
          : "border-stone-200/80 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-md">
          {typeIcon}
          {readOnly ? (
            <span
              className={`min-w-0 truncate ${
                darkMode ? "text-stone-100" : "text-stone-900"
              }`}
            >
              {title}
            </span>
          ) : renamingTitle ? (
            <input
              value={quickTitle}
              autoFocus
              aria-label="Rename content title"
              onChange={(event) => setQuickTitle(event.target.value)}
              onBlur={() => {
                if (skipRenameSaveRef.current) {
                  skipRenameSaveRef.current = false;
                  return;
                }
                saveTitleOnly();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  skipRenameSaveRef.current = true;
                  saveTitleOnly();
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  skipRenameSaveRef.current = true;
                  cancelTitleRename();
                }
              }}
              disabled={mutation.isPending}
              className={`min-w-0 flex-1 cursor-text rounded-lg border px-2 py-1 text-sm font-medium outline-none transition ${
                darkMode
                  ? "border-white/15 bg-slate-900 text-stone-100 focus:border-violet-400/60"
                  : "border-stone-300 bg-white text-stone-900 focus:border-violet-300"
              }`}
            />
          ) : (
            <button
              type="button"
              onClick={startTitleRename}
              className={`min-w-0 cursor-pointer truncate text-left hover:underline ${
                darkMode ? "text-stone-100" : "text-stone-900"
              }`}
              title="Click to rename"
            >
              {title}
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Sbutton
            withSound
            ProvoFunc={copyLink}
            css={
              darkMode
                ? "text-stone-400 hover:text-violet-300"
                : "text-gray-500 hover:text-purple-600"
            }
            StartIcon={<ShareIcon />}
          />
          {!readOnly && (
            <>
              <Sbutton
                withSound
                ProvoFunc={() => deleteMutation.mutate(_id)}
                css={
                  darkMode
                    ? "text-stone-400 hover:text-violet-300"
                    : "text-gray-500 hover:text-purple-600"
                }
                StartIcon={<Trashicon />}
              />
              <div className="relative">
                <button
                  ref={actionMenuTriggerRef}
                  type="button"
                  aria-label="Open card actions"
                  aria-expanded={actionMenuOpen}
                  onClick={() => setActionMenuOpen((current) => !current)}
                  className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition ${
                    darkMode
                      ? "text-stone-400 hover:bg-white/8 hover:text-violet-300"
                      : "text-gray-500 hover:bg-stone-100 hover:text-purple-600"
                  }`}
                >
                  <BsThreeDotsVertical size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>


      <div className="pt-4">
        {type === "Youtube" && embedUrl && (
          <iframe
            className={`${mediaFrameClass}`}
            src={embedUrl}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {type === "Youtube" && !embedUrl && (
          <div className={`${mediaFrameClass} flex items-center justify-center p-4`}>
            <p className="text-sm text-rose-500">Invalid YouTube link</p>
          </div>
        )}

        {type === "Twitter" && (
          <div className={mediaFrameClass}>
            <div className="h-full overflow-auto">
              <blockquote className="twitter-tweet">
                <a href={link.replace("x.com", "twitter.com")}></a>
              </blockquote>
              <script
                async
                src="https://platform.twitter.com/widgets.js"
                charSet="utf-8"
              />
            </div>
          </div>
        )}

        {type === "Spotify" && spotifyEmbedUrl && (
          <iframe
            src={spotifyEmbedUrl}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="aspect-16/5 rounded-xl"
          />
        )}

        {type === "Spotify" && !spotifyEmbedUrl && (
          <p className="text-sm text-rose-500">Invalid Spotify link</p>
        )}

        {type === "Other" && linkedInEmbedUrl && (
          <div
            className={`${mediaFrameClass} !overflow-y-auto ${
              darkMode ? "concious-scrollbar-dark" : "concious-scrollbar-light"
            }`}
          >
            <iframe
              src={linkedInEmbedUrl}
              title="Embedded post"
              width="100%"
              height="1929"
              className="block w-full border-0"
              allowFullScreen
            />
          </div>
        )}

        {type === "Other" && !linkedInEmbedUrl && (
          <div className={`${mediaFrameClass} flex flex-col p-4`}>
            <p
              className={`text-xs uppercase tracking-[0.22em] ${
                darkMode ? "text-stone-400" : "text-stone-500"
              }`}
            >
              Link
            </p>
            <p
              className={`mt-2 line-clamp-2 text-sm font-semibold ${
                darkMode ? "text-stone-100" : "text-stone-900"
              }`}
            >
              {title?.trim() || "Untitled link"}
            </p>
            <p
              className={`mt-1 truncate text-xs ${
                darkMode ? "text-stone-400" : "text-stone-600"
              }`}
            >
              {articleHost ?? "External website"}
            </p>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className={`mt-auto inline-flex w-fit cursor-pointer items-center rounded-lg border px-3 py-2 text-sm font-medium transition ${
                darkMode
                  ? "border-teal-400/25 bg-teal-500/15 text-teal-100 hover:bg-teal-500/25"
                  : "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
              }`}
            >
              Open link
            </a>
          </div>
        )}

        {type === "Article" ? (
          <div className={`${mediaFrameClass} flex flex-col p-4`}>
            <p
              className={`text-xs uppercase tracking-[0.22em] ${
                darkMode ? "text-stone-400" : "text-stone-500"
              }`}
            >
              Article
            </p>
            <p
              className={`mt-2 line-clamp-2 text-sm font-semibold ${
                darkMode ? "text-stone-100" : "text-stone-900"
              }`}
            >
              {title?.trim() || "Untitled article"}
            </p>
            <p
              className={`mt-1 truncate text-xs ${
                darkMode ? "text-stone-400" : "text-stone-600"
              }`}
            >
              {articleHost ?? "External website"}
            </p>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className={`mt-auto inline-flex w-fit cursor-pointer items-center rounded-lg border px-3 py-2 text-sm font-medium transition ${
                darkMode
                  ? "border-sky-400/25 bg-sky-500/15 text-sky-100 hover:bg-sky-500/25"
                  : "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
              }`}
            >
              Open article
            </a>
          </div>
        ) : null}

        {type === "PDF" && (
          <div className={`${mediaFrameClass} flex flex-col p-4`}>
            <p
              className={`text-xs uppercase tracking-[0.22em] ${
                darkMode ? "text-stone-400" : "text-stone-500"
              }`}
            >
              PDF
            </p>
            <p
              className={`mt-2 line-clamp-2 text-sm font-semibold ${
                darkMode ? "text-stone-100" : "text-stone-900"
              }`}
            >
              {pdfFilename?.trim() || title?.trim() || "Untitled PDF"}
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openPdfViewer}
                disabled={pdfLoading}
                aria-busy={pdfLoading}
                className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-wait disabled:opacity-80 ${
                  darkMode
                    ? "border-rose-400/25 bg-rose-500/15 text-rose-100 hover:bg-rose-500/25"
                    : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
              >
                {pdfLoading ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="inline-block size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
                    />
                    Loading...
                  </>
                ) : (
                  "View PDF"
                )}
              </button>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                  darkMode
                    ? "border border-white/10 text-stone-200 hover:bg-white/6"
                    : "border border-stone-200 text-stone-700 hover:bg-stone-100"
                }`}
              >
                Open in new tab
              </a>
            </div>
          </div>
        )}
      </div>

      {editModal}
      {actionMenu}
      {pdfModal}
    </div>
  );
}
