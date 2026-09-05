"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SuccessPage() {
  useEffect(() => {
    // Get session_id from URL and notify Telegram
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (sessionId) {
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }).catch(() => {});
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F2EDE8", fontFamily: "'Inter', -apple-system, sans-serif", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "48px 40px", maxWidth: "480px", textAlign: "center", boxShadow: "0 8px 40px rgba(212,83,126,0.12)" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "36px" }}>
          🎉
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "32px", fontWeight: 400, color: "#1C1A18", marginBottom: "12px" }}>
          Thank you for your order!
        </h1>
        <p style={{ fontSize: "15px", color: "#5F5E5A", lineHeight: 1.7, marginBottom: "8px" }}>
          Your bouquet is being handcrafted fresh in our Edmonton kitchen. 🌸
        </p>
        <p style={{ fontSize: "14px", color: "#888780", lineHeight: 1.7, marginBottom: "32px" }}>
          You&apos;ll receive a confirmation shortly. Please allow 3 days for handcrafting before delivery.
        </p>
        <Link href="/" style={{ display: "inline-block", background: "#D4537E", color: "#fff", fontSize: "14px", fontWeight: 500, padding: "14px 32px", borderRadius: "6px", textDecoration: "none" }}>
          Back to Shop
        </Link>
      </div>
    </div>
  );
}