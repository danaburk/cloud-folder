"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "var(--ink-raised)",
          border: "1px solid rgba(238,241,245,0.08)",
          borderRadius: 4,
          padding: "48px 40px",
          maxWidth: 380,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            color: "var(--brass-bright)",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Reading Room
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 30,
            fontWeight: 600,
            margin: "0 0 8px",
          }}
        >
          Cloud Folder
        </h1>
        <p
          style={{
            color: "var(--ink-soft)",
            fontSize: 14,
            lineHeight: 1.5,
            margin: "0 0 32px",
          }}
        >
          Your textbooks and lectures, open on any desktop.
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={{
            width: "100%",
            padding: "12px 20px",
            background: "var(--brass)",
            color: "#1b2027",
            border: "none",
            borderRadius: 3,
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
