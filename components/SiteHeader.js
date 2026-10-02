"use client";

import { useEffect, useState } from "react";
import styles from "@/app/page.module.css";
import { INSTAGRAM_URL, FACEBOOK_URL } from "@/lib/site";

// Same header as the main shop page, for all other pages (About, FAQ, products, gallery…)
export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("zefir-cart") || "[]");
      setCartCount(cart.reduce((s, i) => s + (i.qty || 1), 0));
    } catch {}
  }, []);

  return (
    <>
      <nav className={styles.nav}>
        <a className={styles.logo} href="/">ZEFIR <span>CANADA</span></a>
        <div className={styles.navLinks}>
          <a className={styles.navLink} href="/?shop=all">Shop</a>
          <a className={styles.navLink} href="/?shop=bouquets">Bouquets</a>
          <a className={styles.navLink} href="/?shop=boxes">Gift Boxes</a>
          <a className={styles.navLink} href="/gallery">Gallery</a>
          <a className={styles.navLink} href="/about">About</a>
        </div>
        <div className={styles.navRight}>
          <a className={styles.socialBtn} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a className={styles.socialBtn} href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a className={styles.navCart} href="/?cart=1" aria-label="Cart">🛍 <span className={styles.cartBadge}>{cartCount}</span></a>
          <button className={styles.navToggle} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? "×" : "☰"}</button>
        </div>
      </nav>
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <a href="/?shop=all">Shop All</a>
          <a href="/?shop=bouquets">Bouquets</a>
          <a href="/?shop=boxes">Gift Boxes</a>
          <a href="/?shop=extras">Extras</a>
          <a href="/gallery">Gallery</a>
          <a href="/about">About</a>
        </div>
      )}
    </>
  );
}
