"use client";

import { useEffect, useMemo, useState } from "react";
import PreviewModal from "./PreviewModal";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  thumbnailLink?: string;
  iconLink?: string;
  webViewLink?: string;
};

type Crumb = { id: string | null; name: string };

const FOLDER_MIME = "application/vnd.google-apps.folder";

function categoryFor(mimeType: string): { label: string; color: string } {
  if (mimeType === FOLDER_MIME) return { label: "DIR", color: "var(--moss)" };
  if (mimeType === "application/pdf") return { label: "BK", color: "var(--brass)" };
  if (mimeType.startsWith("video/")) return { label: "LEC", color: "var(--danger)" };
  if (mimeType.startsWith("image/")) return { label: "IMG", color: "var(--ink-soft)" };
  if (mimeType.includes("presentation")) return { label: "SLD", color: "var(--brass)" };
  if (mimeType.includes("document")) return { label: "DOC", color: "var(--brass)" };
  return { label: "FILE", color: "var(--ink-soft)" };
}

function formatBytes(bytes?: string) {
  if (!bytes) return "—";
  const n = parseInt(bytes, 10);
  if (Number.isNaN(n)) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(0)} KB`;
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${(n / 1024 ** 3).toFixed(2)} GB`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function FileGrid() {
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ id: null, name: "Cloud Folder" }]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<DriveFile | null>(null);

  const currentFolderId = crumbs[crumbs.length - 1].id;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = currentFolderId
      ? `/api/files?folderId=${encodeURIComponent(currentFolderId)}`
      : "/api/files";

    fetch(url)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load files");
        if (!cancelled) setFiles(data.files);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [currentFolderId]);

  const filtered = useMemo(() => {
    if (!query.trim()) return files;
    const q = query.toLowerCase();
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, query]);

  // stable per-category counters for call numbers, based on current list order
  const callNumbers = useMemo(() => {
    const counters: Record<string, number> = {};
    const map = new Map<string, string>();
    for (const f of filtered) {
      const { label } = categoryFor(f.mimeType);
      counters[label] = (counters[label] ?? 0) + 1;
      map.set(f.id, `${label} ${String(counters[label]).padStart(3, "0")}`);
    }
    return map;
  }, [filtered]);

  function openFolder(f: DriveFile) {
    setCrumbs((prev) => [...prev, { id: f.id, name: f.name }]);
    setQuery("");
  }

  function jumpTo(index: number) {
    setCrumbs((prev) => prev.slice(0, index + 1));
    setQuery("");
  }

  return (
    <div style={{ padding: "24px 28px 64px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <nav
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--ink-soft)",
          }}
        >
          {crumbs.map((c, i) => (
            <span key={i}>
              {i > 0 && <span style={{ margin: "0 6px" }}>/</span>}
              <button
                onClick={() => jumpTo(i)}
                style={{
                  background: "none",
                  border: "none",
                  color: i === crumbs.length - 1 ? "var(--brass-bright)" : "var(--ink-soft)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: 0,
                }}
              >
                {c.name}
              </button>
            </span>
          ))}
        </nav>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search this folder…"
          style={{
            background: "var(--ink-raised)",
            border: "1px solid rgba(238,241,245,0.1)",
            borderRadius: 3,
            padding: "8px 12px",
            color: "var(--text-on-ink)",
            fontSize: 13,
            minWidth: 220,
          }}
        />
      </div>

      {loading && (
        <p style={{ color: "var(--ink-soft)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
          Fetching catalog…
        </p>
      )}

      {error && (
        <p style={{ color: "var(--danger)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
          {error}
        </p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p style={{ color: "var(--ink-soft)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
          Nothing here yet.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
          gap: 16,
        }}
      >
        {filtered.map((f) => {
          const isFolder = f.mimeType === FOLDER_MIME;
          const cat = categoryFor(f.mimeType);
          return (
            <button
              key={f.id}
              onClick={() => (isFolder ? openFolder(f) : setActive(f))}
              style={{
                textAlign: "left",
                background: "var(--paper)",
                color: "#2a2620",
                border: "1px solid var(--paper-dim)",
                borderRadius: 3,
                padding: "14px 14px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  color: cat.color,
                  border: `1px solid ${cat.color}`,
                  borderRadius: 2,
                  padding: "2px 5px",
                  transform: "rotate(1.5deg)",
                }}
              >
                {callNumbers.get(f.id)}
              </span>

              {f.thumbnailLink && !isFolder ? (
                <img
                  src={f.thumbnailLink}
                  alt=""
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: 90,
                    objectFit: "cover",
                    borderRadius: 2,
                    marginTop: 18,
                  }}
                />
              ) : (
                <div style={{ height: 90, marginTop: 18 }} />
              )}

              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  wordBreak: "break-word",
                }}
              >
                {f.name}
              </span>

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "#6b6353",
                }}
              >
                {isFolder ? "folder" : formatBytes(f.size)} · {formatDate(f.modifiedTime)}
              </span>
            </button>
          );
        })}
      </div>

      {active && <PreviewModal file={active} onClose={() => setActive(null)} />}
    </div>
  );
}
