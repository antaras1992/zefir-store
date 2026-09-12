'use client';
import { useState, useEffect, useRef } from 'react';

const CATEGORIES = ['Bouquets', 'Gift Boxes', 'Tulips', 'Roses', 'Other'];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState('');
  const fileRef = useRef();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchPhotos = async () => {
    setLoading(true);
    const r = await fetch('/api/gallery');
    const d = await r.json();
    setPhotos(d.photos || []);
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // We'll verify on server when uploading; for now just store password
    if (password.length < 3) { setAuthError('Enter password'); return; }
    setAuthenticated(true);
    fetchPhotos();
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) { showToast('Select a photo'); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('category', category);
    fd.append('title', title);
    fd.append('password', password);
    const r = await fetch('/api/gallery', { method: 'POST', body: fd });
    const d = await r.json();
    if (d.error) {
      showToast(d.error === 'Unauthorized' ? 'Wrong password' : d.error);
      if (d.error === 'Unauthorized') setAuthenticated(false);
    } else {
      showToast('Photo uploaded!');
      setTitle('');
      setPreview(null);
      fileRef.current.value = '';
      fetchPhotos();
    }
    setUploading(false);
  };

  const handleDelete = async (photo) => {
    if (!confirm(`Delete "${photo.title || photo.category}"?`)) return;
    const r = await fetch('/api/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: photo.id, file_name: photo.file_name, password }),
    });
    const d = await r.json();
    if (d.error) showToast(d.error);
    else { showToast('Deleted'); fetchPhotos(); }
  };

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff8f8' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', padding: 40, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.1)', width: 320 }}>
          <h2 style={{ margin: '0 0 24px', color: '#2d1b1e', textAlign: 'center' }}>🌸 Admin Panel</h2>
          <input
            type="password" placeholder="Admin password" value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #e8c8ca', fontSize: 15, boxSizing: 'border-box', marginBottom: 8 }}
          />
          {authError && <p style={{ color: '#e55', fontSize: 13, margin: '4px 0 8px' }}>{authError}</p>}
          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: 8, border: 'none', background: '#c8737a', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f8', padding: '0 0 60px' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#333', color: '#fff', padding: '12px 20px', borderRadius: 8, zIndex: 1000, fontSize: 14 }}>{toast}</div>
      )}

      <div style={{ background: '#fff', borderBottom: '1px solid #f0e0e0', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 22, color: '#2d1b1e' }}>🌸 Gallery Admin</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/gallery" style={{ color: '#c8737a', textDecoration: 'none', fontSize: 14 }}>View Gallery →</a>
          <button onClick={() => setAuthenticated(false)} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
        {/* Upload form */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 32 }}>
          <h2 style={{ margin: '0 0 20px', color: '#2d1b1e', fontSize: 18 }}>Upload New Photo</h2>
          <form onSubmit={handleUpload}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: '#555' }}>Category *</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e8c8ca', fontSize: 14 }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: '#555' }}>Title (optional)</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Spring Bouquet"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e8c8ca', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: '#555' }}>Photo *</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e8c8ca', fontSize: 14, background: '#fff', boxSizing: 'border-box' }} />
            </div>
            {preview && (
              <div style={{ marginBottom: 16 }}>
                <img src={preview} alt="preview" style={{ maxHeight: 200, borderRadius: 8, objectFit: 'cover' }} />
              </div>
            )}
            <button type="submit" disabled={uploading}
              style={{ padding: '12px 32px', borderRadius: 8, border: 'none', background: uploading ? '#ddd' : '#c8737a', color: '#fff', fontWeight: 700, fontSize: 15, cursor: uploading ? 'not-allowed' : 'pointer' }}>
              {uploading ? 'Uploading...' : '↑ Upload Photo'}
            </button>
          </form>
        </div>

        {/* Photos grid */}
        <h2 style={{ color: '#2d1b1e', marginBottom: 16 }}>All Photos ({photos.length})</h2>
        {loading && <p style={{ color: '#999' }}>Loading...</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {photos.map(photo => (
            <div key={photo.id} style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: '#fff' }}>
              <div style={{ position: 'relative', height: 180 }}>
                <img src={photo.url} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: '#2d1b1e' }}>{photo.title || '—'}</p>
                <p style={{ margin: '2px 0 8px', fontSize: 12, color: '#c8737a' }}>{photo.category}</p>
                <button onClick={() => handleDelete(photo)}
                  style={{ width: '100%', padding: '7px', borderRadius: 6, border: '1px solid #ffbbbb', background: '#fff5f5', color: '#e55', fontSize: 13, cursor: 'pointer' }}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {!loading && photos.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: 40 }}>No photos yet. Upload the first one!</p>}
      </div>
    </div>
  );
}
