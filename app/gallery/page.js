'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const CATEGORIES = ['All', 'Bouquets', 'Gift Boxes', 'Tulips', 'Roses', 'Other'];

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(d => { setPhotos(d.photos || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? photos
    : photos.filter(p => p.category === activeCategory);

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f8', padding: '0 0 60px' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0e0e0', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/" style={{ color: '#c8737a', textDecoration: 'none', fontSize: 14 }}>← Back</a>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, color: '#2d1b1e', fontWeight: 700 }}>Our Work Gallery</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8a6d70' }}>Love a design? Message us its number on Instagram and we&apos;ll make it for you 🌸</p>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ padding: '24px 24px 0', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: activeCategory === cat ? '#c8737a' : '#fff',
              color: activeCategory === cat ? '#fff' : '#c8737a',
              fontWeight: 600, fontSize: 14,
              boxShadow: '0 1px 4px rgba(200,115,122,0.15)',
            }}
          >{cat}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {loading && <p style={{ color: '#999' }}>Loading...</p>}
        {!loading && filtered.length === 0 && (
          <p style={{ color: '#999', gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>No photos in this category yet</p>
        )}
        {filtered.map(photo => (
          <div
            key={photo.id}
            onClick={() => setLightbox(photo)}
            style={{ borderRadius: 12, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', background: '#fff', transition: 'transform .2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ position: 'relative', width: '100%', height: 260 }}>
              <Image src={photo.url} alt={photo.number ? `Marshmallow design #${photo.number} — ${photo.category}` : (photo.title || photo.category)} fill style={{ objectFit: 'cover' }} sizes="320px" />
              {photo.number && (
                <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.95)', color: '#2d1b1e', fontWeight: 700, fontSize: 15, padding: '5px 12px', borderRadius: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.15)' }}>#{photo.number}</span>
              )}
            </div>
            <div style={{ padding: '10px 14px' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#2d1b1e', fontSize: 14 }}>{photo.number ? `Design #${photo.number}` : (photo.title || '')}</p>
              <p style={{ margin: 0, color: '#c8737a', fontSize: 12, marginTop: 2 }}>{photo.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, overflow: 'hidden' }}>
            <img src={lightbox.url} alt={lightbox.title} style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', display: 'block' }} />
            <div onClick={e => e.stopPropagation()} style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '12px 16px', fontSize: 15, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span><b>{lightbox.number ? `Design #${lightbox.number}` : (lightbox.title || '')}</b> · {lightbox.category}</span>
              <a href="https://ig.me/m/handmade_zefir_canada" target="_blank" rel="noopener noreferrer"
                style={{ background: '#c8737a', color: '#fff', padding: '8px 16px', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                Order {lightbox.number ? `design #${lightbox.number}` : 'this design'} →
              </a>
            </div>
          </div>
          <button onClick={() => setLightbox(null)} style={{ position: 'fixed', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: 32, cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </div>
  );
}
