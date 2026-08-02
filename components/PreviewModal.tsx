"use client";

import { useEffect } from "react";

type DriveFile = {
  id: string;
  name: string;
  webViewLink?: string;
};

export default function PreviewModal({
  file,
  onClose,
}: {
  file: DriveFile;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,12,16,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--ink-raised)",
          borderRadius: 4,
          width: "min(1000px, 100%)",
          height: "min(720px, 90dvh)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(238,241,245,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid rgba(238,241,245,0.08)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {file.name}
          </span>
          <div style={{ display: "flex", gap: 10, flexShrink: 0, marginLeft: 12 }}>
            {file.webViewLink && (
              <a
                href={file.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12,
                  color: "var(--brass-bright)",
                  textDecoration: "none",
                  alignSelf: "center",
                }}
              >
                Open in Drive ↗
              </a>
            )}
            <button
              onClick={onClose}
              aria-label="Close preview"
              style={{
                background: "transparent",
                border: "1px solid rgba(238,241,245,0.16)",
                color: "var(--text-on-ink)",
                borderRadius: 3,
                padding: "4px 10px",
                fontSize: 13,
              }}
            >
              Close
            </button>
          </div>
        </div>
        <iframe
          src={`https://drive.google.com/file/d/${file.id}/preview`}
          title={file.name}
          allow="autoplay"
          style={{ border: "none", flex: 1, background: "#fff" }}
        />
      </div>
    </div>
  );
}
