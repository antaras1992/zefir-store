"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

// ============ PRODUCT DATA ============
const PRODUCTS = [
  { id: "tulip-bouquet", cat: "bouquets", name: "Tulip Bouquet", badge: "Bestseller", featured: true,
    desc: "Hand-piped marshmallow tulips arranged into a beautiful edible bouquet. Made fresh to order in our Edmonton kitchen.",
  color: "#FBEAF0", flower: "tulip", selectColor: true, image: "/tulip-bouquet.jpg",
    sizes: [{ n: "S", d: "~15 cm", p: 50 }, { n: "M", d: "~20 cm", p: 70 }, { n: "L", d: "~30 cm", p: 90 }],
    flavors: ["Strawberry", "Apple", "Vanilla"], card: true },
  { id: "mixed-bouquet", cat: "bouquets", name: "Mixed Flower Bouquet", badge: "Premium", featured: true,
    desc: "A stunning mix of marshmallow flowers in different shapes and colors. Our most impressive arrangement.",
   color: "#FAECE7", flower: "mixed", image: "/mixed-bouquet.jpg", flowerTypes: ["Tulip","Peony","Rose","Ranunculus","Hydrangea","Dahlia","Chrysanthemum"],
    sizes: [{ n: "S", d: "~15 cm", p: 70 }, { n: "M", d: "~20 cm", p: 90 }, { n: "L", d: "~30 cm", p: 120 }],
    flavors: ["Strawberry", "Apple", "Vanilla"], card: true },
  { id: "tulip-box-4", cat: "boxes", name: "Tulip Box — 4 pieces", badge: "Min. 4 boxes", featured: false,
color: "#F5F0FC", flower: "box", selectColor: true, image: "/tulip-box-4.jpg",
      sizes: [{ n: "Clear box", d: "4 pieces", p: 12 }], flavors: ["Strawberry", "Apple", "Vanilla"], card: true, min: 4 },
    { id: "tulip-box-10", cat: "boxes", name: "Tulip Box — 10 pieces", badge: "", featured: true,
    desc: "Ten marshmallow tulips beautifully arranged in a clear gift box.",
    color: "#FBEAF0", flower: "box", selectColor: true, image: "/tulip-box-10.jpg",
    sizes: [{ n: "Clear box", d: "10 pieces", p: 35 }], flavors: ["Strawberry", "Apple", "Vanilla"], card: true },
  { id: "tulip-box-12", cat: "boxes", name: "Tulip Box — 12 pieces", badge: "", featured: false,
    desc: "A dozen marshmallow tulips in an elegant white gift box.",
    color: "#FAFAF8", flower: "box", selectColor: true, image: "/tulip-box-12.jpg",
    sizes: [{ n: "White box", d: "12 pieces", p: 35 }], flavors: ["Strawberry", "Apple", "Vanilla"], card: true },
  { id: "tulip-box-20", cat: "boxes", name: "Tulip Box — 20 pieces", badge: "Best value", featured: false,
    desc: "Twenty marshmallow tulips — a generous gift box for someone special.",
    color: "#FAECE7", flower: "box", selectColor: true, image: "/tulip-box-20.jpg",
    sizes: [{ n: "Gift box", d: "20 pieces", p: 50 }], flavors: ["Strawberry", "Apple", "Vanilla"], card: true },
  { id: "single-tulip", cat: "extras", name: "Individual Tulip Flower", badge: "", featured: false,
    desc: "A single marshmallow tulip in its own packaging. Great as a favour or add-on.",
    color: "#F5F0FC", flower: "single", selectColor: true, image: "/single-tulip.jpg",
    sizes: [{ n: "Single", d: "1 flower", p: 3 }], flavors: ["Strawberry", "Apple", "Vanilla"], card: false },
  { id: "flower-basket", cat: "extras", name: "Flower Basket", badge: "", featured: false,
    desc: "Marshmallow flowers arranged in a charming basket. A unique gift that stands out.",
    color: "#FBEAF0", flower: "basket", flowerTypes: ["Tulip","Peony","Rose","Ranunculus","Hydrangea","Dahlia","Chrysanthemum"], image: "/flower-basket.jpg",
    sizes: [{ n: "Basket", d: "One size", p: 50 }], flavors: ["Strawberry", "Apple", "Vanilla"], card: true },
];

// ============ FLOWER SVG ============
function Flower({ type, size = 100 }) {
  if (type === "box") return (
    <svg width={size} height={size} viewBox="0 0 100 100"><rect x="20" y="38" width="60" height="42" rx="5" fill="#F0997B"/><rect x="20" y="38" width="60" height="12" rx="3" fill="#D85A30"/><circle cx="35" cy="30" r="8" fill="#ED93B1"/><circle cx="50" cy="27" r="8" fill="#F4C0D1"/><circle cx="65" cy="30" r="8" fill="#ED93B1"/></svg>
  );
  if (type === "single") return (
    <svg width={size} height={size} viewBox="0 0 100 100"><path d="M50 74 Q34 54 34 40 Q34 26 50 26 Q66 26 66 40 Q66 54 50 74Z" fill="#F4C0D1"/><circle cx="50" cy="40" r="10" fill="#D4537E"/></svg>
  );
  if (type === "basket") return (
    <svg width={size} height={size} viewBox="0 0 100 100"><circle cx="38" cy="34" r="10" fill="#ED93B1"/><circle cx="55" cy="30" r="10" fill="#F4C0D1"/><circle cx="48" cy="42" r="10" fill="#D4537E"/><path d="M28 50 L72 50 L66 76 L34 76 Z" fill="#C89464"/><path d="M28 50 L72 50" stroke="#A67848" strokeWidth="3"/></svg>
  );
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g transform="translate(50,46)">
        {petals.map((r, i) => (
          <ellipse key={i} cx="0" cy="-26" rx="9" ry="16" fill={i % 2 ? "#F4C0D1" : "#ED93B1"} transform={`rotate(${r})`} />
        ))}
        <circle r="14" fill="#D4537E" /><circle r="8" fill="#993556" />
      </g>
    </svg>
  );
}

// ============ MAIN COMPONENT ============
export default function Home() {
  const [page, setPage] = useState("home");
  const [shopCat, setShopCat] = useState("all");
  const [product, setProduct] = useState(null);
  const [selSize, setSelSize] = useState(0);
  const [selFlavor, setSelFlavor] = useState(0);
  const [selQty, setSelQty] = useState(1);
  const [selMsg, setSelMsg] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  // Shipping state
  const [postal, setPostal] = useState("");
  const [shipOptions, setShipOptions] = useState([]);
  const [selShip, setSelShip] = useState(null);
const [calcLoading, setCalcLoading] = useState(false);
const [flowerMode, setFlowerMode] = useState(null);
  const [selColor, setSelColor] = useState(null);
  const [addCard, setAddCard] = useState(() => {
    try { return localStorage.getItem("zefir-addCard") === "true"; } catch { return false; }
  });
  const [pendingColor, setPendingColor] = useState(null);
const [selFlowers, setSelFlowers] = useState([]);
const [flowerColors, setFlowerColors] = useState({});

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const goShop = (cat) => { setShopCat(cat); setPage("shop"); setMenuOpen(false); window.scrollTo(0, 0); };
  const goHome = () => { setPage("home"); setMenuOpen(false); window.scrollTo(0, 0); };
  const goAbout = () => { setPage("about"); setMenuOpen(false); window.scrollTo(0, 0); };

  
  useEffect(() => {
    setCart(prev => {
      const base = prev.filter(i => i.id !== "greeting-card");
      if (addCard) return [...base, {id:"greeting-card",name:"Greeting Card +$5",price:5,qty:1,image:null}];
      return base;
    });
  }, [addCard]);
  
  const _cartMounted = useRef(false);
  useEffect(() => {
    if (!_cartMounted.current) {
      _cartMounted.current = true;
      try {
        const saved = localStorage.getItem("zefir-cart");
        if (saved) setCart(JSON.parse(saved));
      } catch {}
    } else {
      try { localStorage.setItem("zefir-cart", JSON.stringify(cart)); } catch {}
    }
  }, [cart]);

  const openProduct = (p) => {
    setProduct(p); setSelSize(0); setSelFlavor(0); setSelQty(p.min || 1); setSelMsg("");
setPage("product"); window.scrollTo(0, 0);setFlowerMode(null); setSelFlowers([]); setFlowerColors({}); setSelColor(null);
    setAddCard(false); setPendingColor(null); setAddCard(false);
};
  const priceRange = (p) => {
    const prices = p.sizes.map((s) => s.p);
    const min = Math.min(...prices), max = Math.max(...prices);
    return min === max ? `$${min}` : `from $${min}`;
  };

  const addToCart = () => {
    const p = product;
    setCart([...cart, {
      id: p.id, name: p.name, size: p.sizes[selSize].n, flavor: p.flavors[selFlavor],
price: p.sizes[selSize].p, qty: selQty, msg: selMsg, flower: p.flower,
      flowers: p.flowerTypes ? selFlowers.map(f => `${f} (${flowerColors[f]||'?'})`).join(', ') : p.selectColor && selColor ? `Color: ${selColor}` : null,
    }]);
    showToast("Added to cart ✓");
    setCartOpen(true);
  };

  const changeQty = (idx, d) => {
    const p = PRODUCTS.find((x) => x.id === cart[idx].id);
    const min = p.min || 1;
    const next = [...cart];
    next[idx].qty = Math.max(min, next[idx].qty + d);
    setCart(next);
  };
  const removeItem = (idx) => setCart(cart.filter((_, i) => i !== idx));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipCost = selShip ? selShip.price : 0;
  const grandTotal = subtotal + shipCost;

  // Calculate shipping options for entered postal code
  const calcShipping = async () => {
    if (!postal || postal.trim().length < 3) {
      showToast("Enter a valid postal code");
      return;
    }
    setCalcLoading(true);
    setShipOptions([]);
    setSelShip(null);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, postalCode: postal }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      if (data.options && data.options.length > 0) {
        setShipOptions(data.options);
        setSelShip(data.options[0]);
      } else {
        showToast(data.error || "No shipping options found");
      }
    } catch (e) {
      clearTimeout(timer);
      showToast(e.name === "AbortError" ? "Request timed out — try again" : "Couldn't calculate shipping");
    }
    setCalcLoading(false);
  };

  const [checkingOut, setCheckingOut] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!selShip) {
      showToast("Please calculate & select shipping first");
      return;
    }
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, shipping: selShip, deliveryDate }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe
      } else {
        showToast(data.error || "Something went wrong");
        setCheckingOut(false);
      }
    } catch (e) {
      showToast("Payment error. Please try again.");
      setCheckingOut(false);
    }
  };

  const shopList = shopCat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === shopCat);
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const shopTitles = { all: "All Products", bouquets: "Bouquets", boxes: "Gift Boxes", extras: "Extras" };

  const ProductCard = ({ p }) => (
    <div className={styles.productCard} onClick={() => openProduct(p)}>
      <div className={styles.productImg} style={{ background: p.color }}>
        {p.badge && <span className={styles.productBadge}>{p.badge}</span>}
        {p.image ? <img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} /> : <Flower type={p.flower} size={90} />}
      </div>
      <div className={styles.productBody}>
        <div className={styles.productCat}>{p.cat}</div>
        <div className={`${styles.productName} ${styles.serif}`}>{p.name}</div>
        <div className={styles.productPrice}>{priceRange(p)} <small>CAD</small></div>
      </div>
    </div>
  );

  return (
    <div className={styles.wrap}>
      {/* NAV */}
      <nav className={styles.nav}>
        <a className={styles.logo} onClick={goHome}>ZEFIR <span>CANADA</span></a>
        <div className={styles.navLinks}>
          <a className={styles.navLink} onClick={() => goShop("all")}>Shop</a>
          <a className={styles.navLink} onClick={() => goShop("bouquets")}>Bouquets</a>
          <a className={styles.navLink} onClick={() => goShop("boxes")}>Gift Boxes</a>
          <a className={styles.navLink} href="/gallery">Gallery</a>
          <a className={styles.navLink} onClick={goAbout}>About</a>
        </div>
        <div className={styles.navRight}>
          <button className={styles.navCart} onClick={() => setCartOpen(true)}>🛍 <span className={styles.cartBadge}>{cartCount}</span></button>
          <button className={styles.navToggle} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "×" : "☰"}</button>
        </div>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <a onClick={() => goShop("all")}>Shop All</a>
          <a onClick={() => goShop("bouquets")}>Bouquets</a>
          <a onClick={() => goShop("boxes")}>Gift Boxes</a>
          <a onClick={() => goShop("extras")}>Extras</a>
          <a href="/gallery">Gallery</a>
            <a onClick={goAbout}>About</a>
        </div>
      )}

      {/* HOME */}
      {page === "home" && (
        <>
          <section className={styles.hero}>
            <div>
              <div className={styles.heroEyebrow}>Handmade in Edmonton, AB</div>
              <h1 className={styles.serif}>Marshmallow Bouquets That Surprise &amp; Delight</h1>
              <p>Beautiful edible flower bouquets for birthdays, weddings and special moments. Handcrafted fresh, delivered across Edmonton, Leduc &amp; all of Canada.</p>
              <div className={styles.heroBtns}>
                <a className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => goShop("all")}>Shop Collection</a>
                <a className={`${styles.btn} ${styles.btnOutline}`} onClick={() => goShop("bouquets")}>View Bouquets</a>
                <a className={`${styles.btn} ${styles.btnOutline}`} href="/gallery">Our Gallery</a>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.heroBadge}>Handmade to order</div>
              <img src="/hero.jpg" alt="Zefir Canada marshmallow bouquet gift boxes" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
              <div className={styles.heroTag}>Looks real. Tastes magical.</div>
            </div>
          </section>

          <div className={styles.trustBar}>
            <div className={styles.trustItem}><span className={styles.trustDot}></span>Handmade in Edmonton</div>
            <div className={styles.trustItem}><span className={styles.trustDot}></span>Fresh to order</div>
            <div className={styles.trustItem}><span className={styles.trustDot}></span>Local delivery &amp; pickup</div>
            <div className={styles.trustItem}><span className={styles.trustDot}></span>Ships across Canada</div>
            <div className={styles.trustItem}><span className={styles.trustDot}></span>🔒 Secure checkout</div>
          </div>

          <section>
            <div className={styles.secEyebrow}>Shop by category</div>
            <h2 className={`${styles.secTitle} ${styles.serif}`}>Find the perfect gift</h2>
            <p className={styles.secSub}>Handcrafted marshmallow flowers for every occasion.</p>
            <div className={styles.catTiles}>
              <div className={styles.catTile} onClick={() => goShop("bouquets")}>
                <div className={styles.catTileImg} style={{ background: "#FBEAF0" }}><Flower type="tulip" size={80} /></div>
                <div className={styles.catTileBody}><div className={`${styles.catTileName} ${styles.serif}`}>Bouquets</div><div className={styles.catTileCount}>Tulip &amp; Mixed · from $50</div></div>
              </div>
              <div className={styles.catTile} onClick={() => goShop("boxes")}>
                <div className={styles.catTileImg} style={{ background: "#FAECE7" }}><Flower type="box" size={80} /></div>
                <div className={styles.catTileBody}><div className={`${styles.catTileName} ${styles.serif}`}>Gift Boxes</div><div className={styles.catTileCount}>4–20 pieces · from $12</div></div>
              </div>
              <div className={styles.catTile} onClick={() => goShop("extras")}>
                <div className={styles.catTileImg} style={{ background: "#F5F0FC" }}><Flower type="single" size={80} /></div>
                <div className={styles.catTileBody}><div className={`${styles.catTileName} ${styles.serif}`}>Extras</div><div className={styles.catTileCount}>Single flowers · baskets</div></div>
              </div>
            </div>
          </section>

          <section className={styles.secCream}>
            <div className={styles.secEyebrow}>Bestsellers</div>
            <h2 className={`${styles.secTitle} ${styles.serif}`}>Most loved</h2>
            <p className={styles.secSub}>Edmonton&apos;s favourites, made fresh to order.</p>
            <div className={styles.productGrid}>
              {featured.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </section>

          <section>
            <div className={styles.secEyebrow}>Why Zefir</div>
            <h2 className={`${styles.secTitle} ${styles.serif}`}>Not flowers. Not candy. Both.</h2>
            <p className={styles.secSub}>The gift they photograph before they eat.</p>
            <div className={styles.benefits}>
              <div className={styles.benefit}><div className={styles.benefitIcon}>🌸</div><h4>So real, they&apos;ll stare</h4><p>Hand-piped petal by petal until it looks like a real bouquet.</p></div>
              <div className={styles.benefit}><div className={styles.benefitIcon}>🎁</div><h4>Gift-ready</h4><p>Beautiful packaging and your personal card included.</p></div>
              <div className={styles.benefit}><div className={styles.benefitIcon}>📦</div><h4>Ships Canada-wide</h4><p>Specially packed to arrive fresh anywhere in Canada.</p></div>
              <div className={styles.benefit}><div className={styles.benefitIcon}>✨</div><h4>Made fresh</h4><p>Every order handcrafted after you place it. Never from a shelf.</p></div>
            </div>
          </section>

          <section className={styles.secCream}>
            <div className={styles.secEyebrow}>Real customers</div>
            <h2 className={`${styles.secTitle} ${styles.serif}`}>Loved across Canada</h2>
            <p className={styles.secSub}>★★★★★ What people say about their bouquets</p>
            <div className={styles.reviews}>
              <div className={styles.review}>
                <div className={styles.reviewStars}>★★★★★</div>
                <p className={styles.reviewText}>&ldquo;These edible tulips are as stunning as they are delicious! Each delicate bloom is crafted from soft, pillowy marshmallow infused with real fruit purée — the flavor is fresh, not overly sweet, and absolutely delightful. A perfect balance of beauty and taste — almost too pretty to eat... almost!&rdquo;</p>
                <div className={styles.reviewName}>— Danika</div>
              </div>
              <div className={styles.review}>
                <div className={styles.reviewStars}>★★★★★</div>
                <p className={styles.reviewText}>&ldquo;These are so gorgeous 😍💖 Great job! 👏&rdquo;</p>
                <div className={styles.reviewName}>— Jaya</div>
              </div>
              <div className={styles.review}>
                <div className={styles.reviewStars}>★★★★★</div>
                <p className={styles.reviewText}>&ldquo;Highly recommended ❤️❤️❤️❤️&rdquo;</p>
                <div className={styles.reviewName}>— Jessy</div>
              </div>
              <div className={styles.review}>
                <div className={styles.reviewStars}>★★★★★</div>
                <p className={styles.reviewText}>&ldquo;So good — I am very happy! 😊 Will order again.&rdquo;</p>
                <div className={styles.reviewName}>— Yevhenii</div>
              </div>
            </div>
          </section>

          <section className={styles.secDark} style={{ textAlign: "center" }}>
            <h2 className={`${styles.secTitle} ${styles.serif}`}>Make their day unforgettable</h2>
            <p style={{ color: "#888780", fontSize: "14px", marginBottom: "28px" }}>Handcrafted fresh · Gift-ready · Local delivery or Canada-wide shipping</p>
            <a className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => goShop("all")}>Start Your Order</a>
          </section>
        </>
      )}

      {/* SHOP */}
      {page === "shop" && (
        <section>
          <div className={styles.secEyebrow}>Our collection</div>
          <h2 className={`${styles.secTitle} ${styles.serif}`}>{shopTitles[shopCat]}</h2>
          <p className={styles.secSub}>Handcrafted marshmallow flowers, made fresh in Edmonton.</p>
          <div className={styles.filterBar}>
            {["all", "bouquets", "boxes", "extras"].map((c) => (
              <button key={c} className={`${styles.filterBtn} ${shopCat === c ? styles.filterActive : ""}`} onClick={() => setShopCat(c)}>
                {c === "all" ? "All" : shopTitles[c]}
              </button>
            ))}
          </div>
          <div className={styles.productGrid}>
            {shopList.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      {/* PRODUCT */}
      {page === "product" && product && (
        <section>
          <div className={styles.pdp}>
            <div className={styles.pdpImg} style={{ background: product.color }}>{product.image ? <img src={product.image} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block",borderRadius:"inherit"}} /> : <Flower type={product.flower} size={180} />}</div>
            <div>
              <div className={styles.pdpBreadcrumb}><span onClick={() => goShop(product.cat)} style={{ cursor: "pointer" }}>{product.cat}</span> / {product.name}</div>
              <div className={`${styles.pdpName} ${styles.serif}`}>{product.name}</div>
              <div className={styles.pdpPrice}>${product.sizes[selSize].p} <span style={{ fontSize: "14px", color: "#888780", fontWeight: 400 }}>CAD</span></div>
              <div className={styles.pdpDesc}>{product.desc}</div>

              {product.sizes.length > 1 ? (
                <>
                  <div className={styles.pdpLabel}>Size</div>
                  <div className={styles.optRow}>
                    {product.sizes.map((s, i) => (
                      <button key={i} className={`${styles.optBtn} ${i === selSize ? styles.optActive : ""}`} onClick={() => setSelSize(i)}>
                        {s.n}<small>{s.d} · ${s.p}</small>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.pdpLabel}>{product.sizes[0].n} · {product.sizes[0].d}</div>
              )}

              <div className={styles.pdpLabel}>Flavor</div>
              <div className={styles.optRow}>
                {product.flavors.map((f, i) => (
                  <button key={i} className={`${styles.optBtn} ${i === selFlavor ? styles.optActive : ""}`} onClick={() => setSelFlavor(i)}>{f}</button>
                ))}
              </div>

{product.selectColor && (<>
  <div className={styles.pdpLabel}>Select color</div>
  <div className={styles.optRow} style={{flexWrap:"wrap"}}>
    {["White","Yellow","Pink","Purple","Orange","Blue","Red"].map((c)=>(
      <button key={c} className={`${styles.optBtn} ${selColor===c?styles.optActive:""}`}
        onClick={()=>setSelColor(c)}>{c}</button>
    ))}
  </div>
</>)}

{product.flowerTypes && (<>
        <div className={styles.pdpLabel}>
          {flowerMode===null ? "Choose type" : pendingColor ? `Color for: ${pendingColor}` : `Flowers: ${selFlowers.length}${flowerMode==="mix" && selFlowers.length>=2?" (can add one more)":""}`}
        </div>

        {flowerMode===null && (
          <div className={styles.optRow}>
            <button className={styles.optBtn} onClick={()=>setFlowerMode("single")}>Single</button>
            <button className={styles.optBtn} onClick={()=>setFlowerMode("mix")}>Mix (2–3)</button>
          </div>
        )}

        {flowerMode!==null && !pendingColor && (flowerMode==="mix" ? selFlowers.length<3 : selFlowers.length<1) && (
          <div className={styles.optRow} style={{flexWrap:"wrap"}}>
            {product.flowerTypes.map((f)=>(
              <button key={f}
                className={`${styles.optBtn} ${selFlowers.includes(f)?styles.optActive:""}`}
                disabled={selFlowers.includes(f)}
                style={selFlowers.includes(f)?{opacity:0.35,cursor:'not-allowed'}:{}}
                onClick={()=>{ setSelFlowers(prev=>[...prev,f]); setPendingColor(f); }}
              >{f}</button>
            ))}
          </div>
        )}

        {pendingColor && (<>
          <div className={styles.optRow} style={{flexWrap:"wrap"}}>
            {["White","Yellow","Pink","Purple","Orange","Blue","Red"].map((col)=>(
              <button key={col}
                className={`${styles.optBtn} ${flowerColors[pendingColor]===col?styles.optActive:""}`}
                onClick={()=>{ setFlowerColors(prev=>({...prev,[pendingColor]:col})); setPendingColor(null); }}
              >{col}</button>
            ))}
          </div>
        </>)}

        {selFlowers.length>0 && (
          <div style={{fontSize:"13px",color:"#888",marginTop:"6px",lineHeight:"1.8"}}>
            {selFlowers.map(f=>(
              <span key={f} style={{display:"inline-block",marginRight:"12px",
                color: flowerColors[f]?"#555":"#c0717a"}}>
                {f}{flowerColors[f]?` — ${flowerColors[f]}`:" — choose color ↑"}
              </span>
            ))}
          </div>
        )}
      </>)}

{product.card && (
                 <>
                  <div style={{marginBottom:"14px"}}>
          <button
            onClick={()=>{
              setAddCard(v=>{
                const next=!v;
                try { localStorage.setItem("zefir-addCard", next); } catch {}
                setCart(prev=>{
                  const base=prev.filter(i=>i.id!=="greeting-card");
                  return next?[...base,{id:"greeting-card",name:"Greeting Card +$5",price:5,qty:1,image:null}]:base;
                });
                return next;
              });
            }}
            style={{
              padding:"10px 18px",borderRadius:"8px",width:"100%",textAlign:"left",
              border:addCard?"2px solid #c0717a":"1px solid #ddd",
              background:addCard?"#fff0f2":"#fafafa",
              color:addCard?"#c0717a":"#666",
              fontWeight:addCard?"600":"400",
              cursor:"pointer",fontSize:"14px"
            }}
          >
            {addCard?"✓ Greeting card with inscription — +$5":"＋ Add greeting card with inscription (+$5)"}
          </button>
        </div>

        <div className={styles.pdpLabel}>Add a personal message (optional)</div>
                  <textarea className={styles.msgField} placeholder="E.g. Happy Birthday! ❤️" value={selMsg} onChange={(e) => setSelMsg(e.target.value)} />
                </>
              )}

              {product.min && <div className={styles.pdpMinNote}>📦 Minimum order: {product.min} boxes</div>}

              <div className={styles.qtyRow}>
                <div className={styles.pdpLabel} style={{ margin: 0 }}>Quantity</div>
                <div className={styles.qtyCtrl}>
                  <button className={styles.qtyBtn} onClick={() => setSelQty(Math.max(product.min || 1, selQty - 1))}>−</button>
                  <span className={styles.qtyVal}>{selQty}</span>
                  <button className={styles.qtyBtn} onClick={() => setSelQty(selQty + 1)}>+</button>
                </div>
              </div>

<button className={styles.pdpAdd} onClick={addToCart} disabled={product.flowerTypes&&(flowerMode==="mix"?(selFlowers.length<2||Object.keys(flowerColors).length<selFlowers.length):(selFlowers.length===0||Object.keys(flowerColors).length<selFlowers.length))} style={product.flowerTypes&&(flowerMode==="mix"?(selFlowers.length<2||Object.keys(flowerColors).length<selFlowers.length):(selFlowers.length===0||Object.keys(flowerColors).length<selFlowers.length))?{opacity:0.4,cursor:'not-allowed'}:{}}>Add to Cart</button>
              <div className={styles.pdpTrust}>✓ Handmade fresh to order · 3 days before delivery<br />✓ Local delivery, pickup &amp; Canada-wide shipping<br />✓ Gift-ready packaging included</div>
            </div>
          </div>
        </section>
      )}
      {/* ABOUT */}
      {page === "about" && (
        <section>
          <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
            <div className={styles.secEyebrow}>Our story</div>
            <h2 className={`${styles.secTitle} ${styles.serif}`}>Made by hand, made with care</h2>
            <p style={{ fontSize: "15px", color: "#5F5E5A", lineHeight: 1.8, marginBottom: "20px" }}>Zefir Canada started with a simple idea: a gift that&apos;s both beautiful and delicious. Every marshmallow flower is hand-piped in our Edmonton kitchen using natural food colors and quality ingredients.</p>
            <p style={{ fontSize: "15px", color: "#5F5E5A", lineHeight: 1.8 }}>We handcraft each order fresh — never from a shelf. Whether it&apos;s delivered locally in Edmonton and Leduc or shipped across Canada with our special fresh-keeping packaging, every bouquet arrives ready to surprise and delight.</p>
          </div>
        </section>
      )}

      {/* CART DRAWER */}
      <div className={`${styles.overlay} ${cartOpen ? styles.overlayOpen : ""}`} onClick={() => setCartOpen(false)}></div>
      <div className={`${styles.cartDrawer} ${cartOpen ? styles.cartDrawerOpen : ""}`}>
        <div className={styles.cartHead}>
          <h3 className={styles.serif}>Your Cart</h3>
          <button className={styles.cartClose} onClick={() => setCartOpen(false)}>×</button>
        </div>
        <div className={styles.cartItems}>
          {cart.length === 0 ? (
            <div className={styles.cartEmpty}>Your cart is empty.<br /><br /><a className={`${styles.btn} ${styles.btnOutline}`} onClick={() => { setCartOpen(false); goShop("all"); }}>Shop Now</a></div>
          ) : (
            cart.map((it, idx) => (
              <div key={idx} className={styles.cartLine}>
                <div className={styles.cartLineImg}><Flower type={it.flower} size={44} /></div>
                <div className={styles.cartLineInfo}>
                  <div className={styles.cartLineName}>{it.name}</div>
                  <div className={styles.cartLineOpts}>{it.size} · {it.flavor}</div>
{it.flowers && <div className={styles.cartLineOpts}>🌸 {it.flowers}</div>}
{it.msg && <div className={styles.cartLineMsg}>💌 &quot;{it.msg}&quot;</div>}
                  <div className={styles.cartLineBottom}>
                    <div className={styles.cartLineQty}>
                      <button onClick={() => changeQty(idx, -1)}>−</button>
                      <span>{it.qty}</span>
                      <button onClick={() => changeQty(idx, 1)}>+</button>
                    </div>
                    <div className={styles.cartLinePrice}>${it.price * it.qty}</div>
                  </div>
                  <div className={styles.cartRemove} onClick={() => removeItem(idx)}>Remove</div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className={styles.cartFoot}>
            <div className={styles.cartSubtotal}><span>Subtotal</span><span>${subtotal}</span></div>

            {/* Shipping calculator */}
            <div style={{ margin: "14px 0", paddingTop: "12px", borderTop: "1px solid #E8E5DF" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px", color: "#1C1A18" }}>Shipping</div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                <input
                  type="text"
                  placeholder="Postal code (e.g. T5J 0N3)"
                  value={postal}
                  onChange={(e) => { setPostal(e.target.value); setShipOptions([]); setSelShip(null); }}
                  onKeyDown={(e) => e.key==="Enter" && calcShipping()}
                  style={{ flex: 1, border: "1px solid #E8E5DF", borderRadius: "6px", padding: "10px 12px", fontSize: "13px", fontFamily: "'Inter',sans-serif", outline: "none" }}
                />
                <button
                  onClick={calcShipping}
                  disabled={calcLoading}
                  style={{ background: "#1C1A18", color: "#fff", border: "none", borderRadius: "6px", padding: "0 16px", fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  {calcLoading ? "..." : "Calculate"}
                </button>
              </div>

              {shipOptions.map((opt) => (
                <label
                  key={opt.id}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", border: `1px solid ${selShip?.id === opt.id ? "#D4537E" : "#E8E5DF"}`, borderRadius: "8px", marginBottom: "6px", cursor: "pointer", background: selShip?.id === opt.id ? "#FFF5F8" : "#fff" }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input type="radio" checked={selShip?.id === opt.id} onChange={() => setSelShip(opt)} style={{ accentColor: "#D4537E" }} />
                    <span>
                      <span style={{ fontSize: "13px", fontWeight: 500, display: "block" }}>{opt.name}</span>
                      <span style={{ fontSize: "11px", color: "#888780" }}>{opt.eta}</span>
                    </span>
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>{opt.price === 0 ? "Free" : `$${opt.price}`}</span>
                </label>
              ))}
            </div>

            <div style={{marginBottom:"12px"}}>
              <label style={{display:"block",fontSize:"13px",fontWeight:600,color:"#555",marginBottom:"6px"}}>📅 When do you need it?</label>
              <input type="date" value={deliveryDate} onChange={e=>setDeliveryDate(e.target.value)} min={new Date(Date.now()+3*86400000).toISOString().split("T")[0]} style={{width:"100%",padding:"10px 12px",borderRadius:"8px",border:"1.5px solid #e8c8ca",fontSize:"14px",boxSizing:"border-box",color:deliveryDate?"#2d1b1e":"#999"}}/>
              {!deliveryDate && <p style={{color:"#c8737a",fontSize:"12px",margin:"4px 0 0"}}>Please select a date</p>}
            </div>
            <div className={styles.cartNote}>Taxes calculated at checkout · 3 days handcrafting time</div>
            <div className={styles.cartTotal}><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
            <button className={styles.cartCheckout} onClick={handleCheckout} disabled={checkingOut}>{checkingOut ? "Redirecting to payment…" : "Proceed to Checkout"}</button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div>
            <div className={styles.footerBrand}>ZEFIR <span>CANADA</span></div>
            <p className={styles.footerDesc}>Premium handmade marshmallow bouquets &amp; gifts. Made fresh in Edmonton, AB. Local delivery and Canada-wide shipping.</p>
          </div>
          <div className={styles.footerCol}>
            <h5>Shop</h5>
            <a onClick={() => goShop("bouquets")}>Bouquets</a>
            <a onClick={() => goShop("boxes")}>Gift Boxes</a>
            <a onClick={() => goShop("extras")}>Extras</a>
          </div>
          <div className={styles.footerCol}>
            <h5>Info</h5>
            <a onClick={goAbout}>About Us</a>
            <a>Shipping</a>
            <a>FAQ</a>
            <a>Contact</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2025 Zefir Canada · Edmonton &amp; Leduc, Alberta</span>
          <span>Visa · Mastercard · Apple Pay · Google Pay</span>
        </div>
      </footer>

      {toast && <div className={`${styles.toast} ${styles.toastShow}`}>{toast}</div>}
    </div>
  );
}