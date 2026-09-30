"use client";

import { useEffect } from "react";
import Link from "next/link";
import { GOOGLE_REVIEW_URL, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/site";

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
        <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid #E8E5DF", fontSize: "13px", color: "#5F5E5A", lineHeight: 1.7 }}>
          {GOOGLE_REVIEW_URL && (
            <>
              Love your gift? A quick Google review helps our small business a lot 💕<br />
              <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "10px", border: "1px solid #D4537E", color: "#D4537E", padding: "10px 22px", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>⭐ Leave a Google review</a>
              <br /><br />
            </>
          )}
          Follow us on Instagram <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#D4537E" }}>{INSTAGRAM_HANDLE}</a>
        </div>
      </div>
    </div>
  );
}