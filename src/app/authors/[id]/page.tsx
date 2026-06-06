'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface Book {
  id: string
  title: string
  genre?: string
  publishedYear?: number
  pages?: number
  description?: string
}

interface Author {
  id: string
  name: string
  email: string
  bio?: string
  nationality?: string
  birthYear?: number
  books: Book[]
}

interface Stats {
  totalBooks: number
  firstBook: { title: string; year: number } | null
  latestBook: { title: string; year: number } | null
  averagePages: number
  genres: string[]
  longestBook: { title: string; pages: number } | null
  shortestBook: { title: string; pages: number } | null
}

export default function AuthorDetailPage() {
  const { id } = useParams()
  const [author, setAuthor] = useState<Author | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showBookForm, setShowBookForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', bio: '', nationality: '', birthYear: '' })
  const [bookForm, setBookForm] = useState({ title: '', description: '', isbn: '', publishedYear: '', genre: '', pages: '' })

  const fetchData = async () => {
    setLoading(true)
    const [authorRes, statsRes] = await Promise.all([
      fetch(`/api/authors/${id}`),
      fetch(`/api/authors/${id}/stats`)
    ])
    const authorData = await authorRes.json()
    const statsData = await statsRes.json()
    setAuthor(authorData)
    setStats(statsData)
    setForm({ name: authorData.name, email: authorData.email, bio: authorData.bio || '', nationality: authorData.nationality || '', birthYear: authorData.birthYear?.toString() || '' })
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [id])

  const handleEditSubmit = async () => {
    await fetch(`/api/authors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setShowEditForm(false)
    fetchData()
  }

  const handleAddBook = async () => {
    await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...bookForm, authorId: id })
    })
    setBookForm({ title: '', description: '', isbn: '', publishedYear: '', genre: '', pages: '' })
    setShowBookForm(false)
    fetchData()
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px',
    border: '1px solid #d1d5db', fontSize: '0.9rem', outline: 'none',
    boxSizing: 'border-box', background: '#fff', color: '#111'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: "'Segoe UI', Inter, sans-serif" }}>
      Cargando...
    </div>
  )

  if (!author) return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: "'Segoe UI', Inter, sans-serif" }}>
      Autor no encontrado
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Segoe UI', Inter, sans-serif" }}>

      {/* Navbar */}
      <div style={{ background: '#1e3a5f', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 19V5a2 2 0 012-2h13a1 1 0 010 2H6a1 1 0 000 2h13v13a1 1 0 01-1 1H6a2 2 0 01-2-2z" fill="#60a5fa"/>
            <path d="M9 7h6M9 11h4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>Biblioteca</span>
        </div>
        <a href="/" style={{ padding: '0.45rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.25)', color: '#e2e8f0', textDecoration: 'none', fontSize: '0.85rem' }}>
          ← Volver
        </a>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>

        {/* Author card */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2563eb', fontSize: '1.4rem', flexShrink: 0 }}>
                {author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{author.name}</h1>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '3px 0' }}>{author.email}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '4px' }}>
                  {author.nationality && <span style={{ color: '#64748b', fontSize: '0.8rem' }}>🌍 {author.nationality}</span>}
                  {author.birthYear && <span style={{ color: '#64748b', fontSize: '0.8rem' }}>🎂 {author.birthYear}</span>}
                </div>
                {author.bio && <p style={{ color: '#475569', fontSize: '0.85rem', margin: '8px 0 0', maxWidth: '500px' }}>{author.bio}</p>}
              </div>
            </div>
            <button onClick={() => setShowEditForm(!showEditForm)}
              style={{ padding: '0.45rem 1rem', borderRadius: '8px', background: '#f8fafc', color: '#374151', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '0.85rem' }}>
              Editar
            </button>
          </div>

          {showEditForm && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ ...input, gridColumn: 'span 2' }} />
                <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={input} />
                <input placeholder="Nacionalidad" value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} style={input} />
                <input placeholder="Año nacimiento" value={form.birthYear} onChange={e => setForm({ ...form, birthYear: e.target.value })} style={input} />
                <textarea placeholder="Biografía" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3}
                  style={{ ...input, gridColumn: 'span 2', resize: 'none' } as React.CSSProperties} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button onClick={handleEditSubmit} style={{ background: '#2563eb', color: '#fff', padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                  Guardar
                </button>
                <button onClick={() => setShowEditForm(false)} style={{ background: '#f1f5f9', color: '#374151', padding: '0.55rem 1.4rem', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1rem' }}>Estadísticas</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              {[
                { label: 'Total libros', value: stats.totalBooks, color: '#2563eb' },
                { label: 'Promedio páginas', value: stats.averagePages, color: '#16a34a' },
                { label: 'Géneros', value: stats.genres.length, color: '#7c3aed' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {stats.genres.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0 0 6px' }}>Géneros escritos:</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {stats.genres.map(g => (
                    <span key={g} style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500, border: '1px solid #bfdbfe' }}>{g}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {[
                { label: 'Primer libro', data: stats.firstBook, sub: stats.firstBook?.year },
                { label: 'Último libro', data: stats.latestBook, sub: stats.latestBook?.year },
                { label: 'Libro más largo', data: stats.longestBook, sub: stats.longestBook ? `${stats.longestBook.pages} págs` : null },
                { label: 'Libro más corto', data: stats.shortestBook, sub: stats.shortestBook ? `${stats.shortestBook.pages} págs` : null },
              ].map((item, i) => item.data && (
                <div key={i} style={{ background: '#f8fafc', borderRadius: '10px', padding: '0.9rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '3px' }}>{item.label}</div>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{(item.data as any).title}</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Books */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Libros del autor</h2>
            <button onClick={() => setShowBookForm(!showBookForm)}
              style={{ padding: '0.4rem 1rem', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
              + Agregar Libro
            </button>
          </div>

          {showBookForm && (
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input placeholder="Título *" value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} style={{ ...input, gridColumn: 'span 2' }} />
                <input placeholder="ISBN" value={bookForm.isbn} onChange={e => setBookForm({ ...bookForm, isbn: e.target.value })} style={input} />
                <input placeholder="Año publicación" value={bookForm.publishedYear} onChange={e => setBookForm({ ...bookForm, publishedYear: e.target.value })} style={input} />
                <input placeholder="Género" value={bookForm.genre} onChange={e => setBookForm({ ...bookForm, genre: e.target.value })} style={input} />
                <input placeholder="Páginas" value={bookForm.pages} onChange={e => setBookForm({ ...bookForm, pages: e.target.value })} style={input} />
                <textarea placeholder="Descripción" value={bookForm.description} onChange={e => setBookForm({ ...bookForm, description: e.target.value })} rows={2}
                  style={{ ...input, gridColumn: 'span 2', resize: 'none' } as React.CSSProperties} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button onClick={handleAddBook} style={{ background: '#2563eb', color: '#fff', padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                  Agregar
                </button>
                <button onClick={() => setShowBookForm(false)} style={{ background: '#f1f5f9', color: '#374151', padding: '0.55rem 1.4rem', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {author.books.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No hay libros aún</div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {author.books.map(book => (
                <div key={book.id} style={{ padding: '0.9rem 1rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{book.title}</div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '4px', flexWrap: 'wrap' }}>
                    {book.genre && <span style={{ color: '#64748b', fontSize: '0.78rem' }}>🏷️ {book.genre}</span>}
                    {book.publishedYear && <span style={{ color: '#64748b', fontSize: '0.78rem' }}>📅 {book.publishedYear}</span>}
                    {book.pages && <span style={{ color: '#64748b', fontSize: '0.78rem' }}>📄 {book.pages} págs</span>}
                  </div>
                  {book.description && <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '6px 0 0' }}>{book.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}