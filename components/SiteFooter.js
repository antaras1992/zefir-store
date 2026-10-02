import styles from "@/app/page.module.css";
import { PRODUCTS } from "@/lib/products";
import { INSTAGRAM_URL, EMAIL, GOOGLE_REVIEW_URL } from "@/lib/site";

// Same footer as the main shop page
export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div>
          <div className={styles.footerBrand}>ZEFIR <span>CANADA</span></div>
          <p className={styles.footerDesc}>Premium handmade marshmallow bouquets &amp; gifts. Made fresh in Leduc, AB. Local delivery in Edmonton &amp; Leduc, pickup, and Canada-wide shipping for gift boxes.</p>
        </div>
        <div className={styles.footerCol}>
          <h5>Shop</h5>
          <a href="/?shop=bouquets">Bouquets</a>
          <a href="/?shop=boxes">Gift Boxes</a>
          <a href="/?shop=extras">Extras</a>
        </div>
        <div className={styles.footerCol}>
          <h5>Our Products</h5>
          {PRODUCTS.map((p) => (
            <a key={p.id} href={`/products/${p.id}`}>{p.name}</a>
          ))}
          <a href="/gallery">Gallery</a>
        </div>
        <div className={styles.footerCol}>
          <h5>Info</h5>
          <a href="/about">About Us</a>
          <a href="/custom-orders">Custom Orders</a>
          <a href="/shipping">Shipping</a>
          <a href="/faq">FAQ &amp; Ingredients</a>
          <a href="/marshmallow-bouquets-edmonton">Edmonton delivery</a>
          <a href="/marshmallow-bouquets-leduc">Leduc delivery</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={`mailto:${EMAIL}`}>Contact</a>
          {GOOGLE_REVIEW_URL && <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">⭐ Review us on Google</a>}
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© {new Date().getFullYear()} Zefir Canada · Edmonton &amp; Leduc, Alberta</span>
        <span>Visa · Mastercard · Apple Pay · Google Pay</span>
      </div>
    </footer>
  );
}
