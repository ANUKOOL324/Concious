import { useRef, useState } from "react";
import axios from "axios";
import { CrossIcon } from "../../Icon/CrossIcon";
import { createContent, uploadPdfContent } from "../../api/contentApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PDF_MAX_BYTES,
  type Content,
  type ContentType,
  type Importance,
} from "../../types/content";
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
  contentModalSectionLabelClass,
} from "./contentModalStyles";
import { ContentTypeSelect } from "./ContentTypeSelect";
import { ImportanceSelect } from "./ImportanceSelect";

interface CreateProps {
  open: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

type Types = ContentType | "initial";

const TYPE_OPTIONS: { label: string; value: ContentType }[] = [
  { label: "Youtube", value: "Youtube" },
  { label: "Twitter", value: "Twitter" },
  { label: "Spotify", value: "Spotify" },
  { label: "Article", value: "Article" },
  { label: "PDF", value: "PDF" },
  { label: "Other", value: "Other" },
];

function trimToLimit(value: string | undefined, maxLength: number) {
  return value?.trim().slice(0, maxLength) || undefined;
}

function parseTags(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10);
}

function isLinkType(type: Types): type is Exclude<ContentType, "PDF"> {
  return type !== "initial" && type !== "PDF";
}

export function CreateContentModal({
  open,
  onClose,
  darkMode = false,
}: CreateProps) {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const linkRef = useRef<HTMLInputElement | null>(null);
  const personalNoteRef = useRef<HTMLTextAreaElement | null>(null);
  const summaryRef = useRef<HTMLTextAreaElement | null>(null);
  const tagsRef = useRef<HTMLInputElement | null>(null);
  const collectionRef = useRef<HTMLInputElement | null>(null);
  const whySavedRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [type, setType] = useState<Types>("initial");
  const [importance, setImportance] = useState<Importance>("medium");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const queryClient = useQueryClient();

  const panelClass = contentModalPanelClass(darkMode);
  const fieldClass = contentModalFieldClass(darkMode);
  const labelClass = contentModalLabelClass(darkMode);
  const sectionLabelClass = contentModalSectionLabelClass(darkMode);

  function resetForm() {
    if (titleRef.current) titleRef.current.value = "";
    if (linkRef.current) linkRef.current.value = "";
    if (personalNoteRef.current) personalNoteRef.current.value = "";
    if (summaryRef.current) summaryRef.current.value = "";
    if (tagsRef.current) tagsRef.current.value = "";
    if (collectionRef.current) collectionRef.current.value = "";
    if (whySavedRef.current) whySavedRef.current.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
    setType("initial");
    setImportance("medium");
    setPdfFile(null);
    setFormError("");
    setShowAdvanced(false);
  }

  function readSharedFields() {
    return {
      title: titleRef.current?.value.trim() ?? "",
      personalNote: trimToLimit(personalNoteRef.current?.value, 1000),
      summary: trimToLimit(summaryRef.current?.value, 1000),
      tags: parseTags(tagsRef.current?.value),
      collection: trimToLimit(collectionRef.current?.value, 80),
      whySaved: trimToLimit(whySavedRef.current?.value, 500),
      importance,
    };
  }

  function validatePdfFile(file: File) {
    const isPdfMime = file.type === "application/pdf";
    const isPdfName = file.name.toLowerCase().endsWith(".pdf");

    if (!isPdfMime || !isPdfName) {
      throw new Error("Only PDF files are allowed.");
    }

    if (file.size > PDF_MAX_BYTES) {
      throw new Error("PDF file exceeds the maximum allowed size of 10MB.");
    }
  }

  async function submitContent() {
    const shared = readSharedFields();

    if (!shared.title || type === "initial") {
      setFormError("Title and type are required.");
      throw new Error("Title and type are required.");
    }

    if (type === "PDF") {
      if (!pdfFile) {
        setFormError("A PDF file is required.");
        throw new Error("A PDF file is required.");
      }

      validatePdfFile(pdfFile);

      return uploadPdfContent({
        file: pdfFile,
        title: shared.title,
        tags: shared.tags,
        personalNote: shared.personalNote,
        summary: shared.summary,
        collection: shared.collection,
        whySaved: shared.whySaved,
        importance: shared.importance,
      });
    }

    if (!isLinkType(type)) {
      setFormError("Title and type are required.");
      throw new Error("Title and type are required.");
    }

    const link = linkRef.current?.value.trim();
    if (!link) {
      setFormError("Title, link, and type are required.");
      throw new Error("Title, link, and type are required.");
    }

    return createContent({
      title: shared.title,
      link,
      type,
      personalNote: shared.personalNote,
      summary: shared.summary,
      tags: shared.tags,
      collection: shared.collection,
      whySaved: shared.whySaved,
      importance: shared.importance,
    });
  }

  function handleTypeChange(nextType: ContentType) {
    setType(nextType);
    setFormError("");
    if (nextType !== "PDF") {
      setPdfFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  const mutation = useMutation({
    mutationFn: submitContent,
    onSuccess: (newContent) => {
      queryClient.setQueryData<Content[]>(["content"], (old = []) => [
        ...old,
        newContent,
      ]);
      resetForm();
      onClose();
    },
    onError: (error) => {
      const message =
        axios.isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : error instanceof Error
            ? error.message
            : "Failed to create content.";

      setFormError(message);
    },
  });

  function handlePdfFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setFormError("");

    if (!file) {
      setPdfFile(null);
      return;
    }

    try {
      validatePdfFile(file);
      setPdfFile(file);
    } catch (error) {
      setPdfFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFormError(error instanceof Error ? error.message : "Invalid PDF file.");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className={`absolute inset-0 ${contentModalOverlayClass(darkMode)}`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-content-title"
        className={`${CONTENT_MODAL_SHELL_CLASS} ${panelClass}`}
      >
        <div className={contentModalHeaderClass(darkMode)}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className={`text-[0.68rem] font-semibold uppercase tracking-[0.28em] ${
                  darkMode ? "text-violet-300" : "text-violet-500"
                }`}
              >
                Create content
              </p>
              <h2
                id="create-content-title"
                className="mt-1 text-xl font-semibold tracking-tight sm:text-[1.35rem]"
              >
                Save something worth revisiting
              </h2>
              <p
                className={`mt-1.5 max-w-lg text-sm leading-relaxed ${
                  darkMode ? "text-stone-400" : "text-stone-500"
                }`}
              >
                Add a link, media post, article, or PDF to your AI-searchable brain.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close modal"
              className={contentModalCloseButtonClass(darkMode)}
              onClick={onClose}
            >
              <CrossIcon />
            </button>
          </div>
        </div>

        <div
          className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 ${contentModalScrollClass(darkMode)}`}
        >
          <div className="space-y-5">
            {type === "PDF" ? (
              <div>
                <label className={labelClass}>Source</label>
                <label
                  className={`block rounded-xl border border-dashed px-4 py-4 text-sm transition ${
                    darkMode
                      ? "border-white/15 bg-slate-900/50 text-stone-300"
                      : "border-stone-300 bg-stone-50 text-stone-600"
                  }`}
                >
                  <span className="font-medium">Upload PDF</span>
                  <span className="mt-1 block text-xs opacity-80">
                    PDF only, max 10MB
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfFileChange}
                    className="mt-3 block w-full cursor-pointer text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:px-3 file:py-2 file:text-sm file:font-medium file:bg-violet-500 file:text-white hover:file:bg-violet-400"
                  />
                </label>
                {pdfFile && (
                  <p
                    className={`mt-2 text-xs ${
                      darkMode ? "text-stone-400" : "text-stone-500"
                    }`}
                  >
                    Selected: {pdfFile.name}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className={labelClass} htmlFor="content-link">
                  Source
                </label>
                <input
                  id="content-link"
                  ref={linkRef}
                  placeholder="Paste the URL"
                  className={fieldClass}
                />
              </div>
            )}

            <div>
              <label className={labelClass} htmlFor="content-title">
                Title
              </label>
              <input
                id="content-title"
                ref={titleRef}
                placeholder="Give this a clear title"
                className={fieldClass}
              />
            </div>

            <div>
              <p className={labelClass}>Type</p>
              <div className="sm:hidden">
                <ContentTypeSelect
                  id="content-type"
                  value={type}
                  options={TYPE_OPTIONS}
                  placeholder="Select type"
                  onChange={handleTypeChange}
                  darkMode={darkMode}
                />
              </div>
              <div className="hidden flex-wrap gap-2 sm:flex">
                {TYPE_OPTIONS.map((option) => {
                  const isSelected = type === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleTypeChange(option.value)}
                      className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                        isSelected
                          ? darkMode
                            ? "border-stone-100 bg-stone-100 text-stone-950 shadow-md"
                            : "border-stone-900 bg-stone-950 text-white shadow-md shadow-stone-900/15"
                          : darkMode
                            ? "border-white/12 bg-slate-900/70 text-stone-300 hover:border-white/20 hover:bg-slate-800"
                            : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={contentModalAiMemorySectionClass(darkMode)}>
              <p
                className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${
                  darkMode ? "text-violet-300/90" : "text-violet-600"
                }`}
              >
                AI memory
              </p>
              <label className={`${sectionLabelClass} mb-3 block normal-case tracking-normal`} htmlFor="content-why-saved">
                What should Ashqnor remember this for?
              </label>
              <textarea
                id="content-why-saved"
                ref={whySavedRef}
                maxLength={500}
                className={`${fieldClass} min-h-[88px] resize-none`}
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
                    <label className={labelClass} htmlFor="content-personal-note">
                      Personal note
                    </label>
                    <textarea
                      id="content-personal-note"
                      ref={personalNoteRef}
                      maxLength={1000}
                      placeholder="Your private note about this item"
                      className={`${fieldClass} min-h-[72px] resize-none`}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="content-summary">
                      Summary
                    </label>
                    <textarea
                      id="content-summary"
                      ref={summaryRef}
                      maxLength={1000}
                      placeholder="Short summary in your own words"
                      className={`${fieldClass} min-h-[72px] resize-none`}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="content-tags">
                      Tags
                    </label>
                    <input
                      id="content-tags"
                      ref={tagsRef}
                      placeholder="Tags: ai, focus, habits"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="content-collection">
                      Collection
                    </label>
                    <input
                      id="content-collection"
                      ref={collectionRef}
                      maxLength={80}
                      placeholder="Collection name"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="content-importance">
                      Importance
                    </label>
                    <ImportanceSelect
                      id="content-importance"
                      value={importance}
                      onChange={setImportance}
                      darkMode={darkMode}
                    />
                  </div>
                </div>
              )}
            </div>

            {formError && (
              <p className="rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-500">
                {formError}
              </p>
            )}
          </div>
        </div>

        <div className={`${contentModalFooterClass(darkMode)} flex justify-end`}>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className={`${contentModalPrimaryButtonClass(darkMode)} min-w-[9.5rem]`}
          >
            {mutation.isPending ? "Creating..." : "Save to brain"}
          </button>
        </div>
      </div>
    </div>
  );
}
