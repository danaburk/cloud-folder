"use client";

import { signOut } from "next-auth/react";

export default function TopBar({ userName }: { userName: string }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 28px",
        borderBottom: "1px solid rgba(238,241,245,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          Cloud Folder
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-soft)",
            letterSpacing: "0.06em",
          }}
        >
          / reading room
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>
          {userName}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            background: "transparent",
            border: "1px solid rgba(238,241,245,0.16)",
            color: "var(--text-on-ink)",
            borderRadius: 3,
            padding: "6px 12px",
            fontSize: 12,
          }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
