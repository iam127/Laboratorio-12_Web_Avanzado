'use client'

import { useState, useEffect, useCallback } from 'react'

interface Book {
  id: string
  title: string
  description?: string
  isbn?: string
  publishedYear?: number
  genre?: string
  pages?: number
  author: { id: string; name: string; email: string }
}

interface Author {
  id: string
  name: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [authorFilter, setAuthorFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [form, setForm] = useState({ title: '', description: '', isbn: '', publishedYear: '', genre: '', pages: '', authorId: '' })

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: page.toString(), limit: '10', sortBy, order,
      ...(search && { search }),
      ...(genre && { genre }),
      ...(authorFilter && { authorName: authorFilter }),
    })
    const res = await fetch(`/api/books/search?${params}`)
    const data = await res.json()
    setBooks(data.data || [])
    setPagination(data.pagination || null)
    setLoading(false)
  }, [page, sortBy, order, search, genre, authorFilter])

  const fetchAuthors = async () => {
    const res = await fetch('/api/authors')
    const data = await res.json()
    setAuthors(data)
  }

  useEffect(() => { fetchAuthors() }, [])
  useEffect(() => { fetchBooks() }, [fetchBooks])

  const handleSubmit = async () => {
    await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ title: '', description: '', isbn: '', publishedYear: '', genre: '', pages: '', authorId: '' })
    setShowForm(false)
    fetchBooks()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar libro?')) return
    await fetch(`/api/books/${id}`, { method: 'DELETE' })
    fetchBooks()
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px',
    border: '1px solid #d1d5db', fontSize: '0.9rem', outline: 'none',
    boxSizing: 'border-box', background: '#fff', color: '#111'
  }

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
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a href="/" style={{ padding: '0.45rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.25)', color: '#e2e8f0', textDecoration: 'none', fontSize: '0.85rem' }}>
            Ver Autores
          </a>
          <button onClick={() => setShowForm(!showForm)}
            style={{ padding: '0.45rem 1.2rem', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            + Nuevo Libro
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Gestión de Libros</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>Busca, filtra y administra los libros de tu biblioteca</p>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Nuevo Libro</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <input placeholder="Título *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ ...input, gridColumn: 'span 2' }} />
              <input placeholder="ISBN" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} style={input} />
              <input placeholder="Año de publicación" value={form.publishedYear} onChange={e => setForm({ ...form, publishedYear: e.target.value })} style={input} />
              <input placeholder="Género" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} style={input} />
              <input placeholder="Páginas" value={form.pages} onChange={e => setForm({ ...form, pages: e.target.value })} style={input} />
              <select value={form.authorId} onChange={e => setForm({ ...form, authorId: e.target.value })}
                style={{ ...input, gridColumn: 'span 2' }}>
                <option value="">Seleccionar autor *</option>
                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <textarea placeholder="Descripción" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                style={{ ...input, gridColumn: 'span 2', resize: 'none' } as React.CSSProperties} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button onClick={handleSubmit} style={{ background: '#2563eb', color: '#fff', padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                Crear
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: '#f1f5f9', color: '#374151', padding: '0.55rem 1.4rem', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.9rem' }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <input placeholder="🔍 Buscar por título..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              style={{ ...input, gridColumn: 'span 2' }} />
            <input placeholder="Filtrar por género" value={genre}
              onChange={e => { setGenre(e.target.value); setPage(1) }}
              style={input} />
            <input placeholder="Filtrar por autor" value={authorFilter}
              onChange={e => { setAuthorFilter(e.target.value); setPage(1) }}
              style={input} />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={input}>
              <option value="createdAt">Ordenar por fecha</option>
              <option value="title">Ordenar por título</option>
              <option value="publishedYear">Ordenar por año</option>
            </select>
            <select value={order} onChange={e => setOrder(e.target.value)} style={input}>
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </div>

        <div style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
          {pagination ? `${pagination.total} libros encontrados` : 'Cargando...'}
        </div>

        {/* Books */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '4rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            Cargando...
          </div>
        ) : books.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '4rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            No se encontraron libros
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {books.map((book, idx) => (
              <div key={book.id} style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx < books.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    📖
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{book.title}</div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '3px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#64748b', fontSize: '0.8rem' }}>✍️ {book.author?.name}</span>
                      {book.genre && <span style={{ color: '#64748b', fontSize: '0.8rem' }}>🏷️ {book.genre}</span>}
                      {book.publishedYear && <span style={{ color: '#64748b', fontSize: '0.8rem' }}>📅 {book.publishedYear}</span>}
                      {book.pages && <span style={{ color: '#64748b', fontSize: '0.8rem' }}>📄 {book.pages} págs</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(book.id)} style={{ padding: '0.35rem 0.85rem', borderRadius: '7px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer', fontSize: '0.82rem', flexShrink: 0 }}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button onClick={() => setPage(p => p - 1)} disabled={!pagination.hasPrev}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0', cursor: pagination.hasPrev ? 'pointer' : 'not-allowed', color: pagination.hasPrev ? '#374151' : '#9ca3af', fontSize: '0.85rem' }}>
              ← Anterior
            </button>
            <span style={{ color: '#64748b', fontSize: '0.85rem', background: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {pagination.page} / {pagination.totalPages}
            </span>
            <button onClick={() => setPage(p => p + 1)} disabled={!pagination.hasNext}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0', cursor: pagination.hasNext ? 'pointer' : 'not-allowed', color: pagination.hasNext ? '#374151' : '#9ca3af', fontSize: '0.85rem' }}>
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </main>
  )
}