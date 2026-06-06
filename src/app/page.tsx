'use client'

import { useState, useEffect } from 'react'

interface Author {
  id: string
  name: string
  email: string
  bio?: string
  nationality?: string
  birthYear?: number
  _count: { books: number }
}

export default function Home() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [form, setForm] = useState({ name: '', email: '', bio: '', nationality: '', birthYear: '' })

  const fetchAuthors = async () => {
    setLoading(true)
    const res = await fetch('/api/authors')
    const data = await res.json()
    setAuthors(data)
    setLoading(false)
  }

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    fetchAuthors()
  }, [])

  const handleSubmit = async () => {
    const method = editingAuthor ? 'PUT' : 'POST'
    const url = editingAuthor ? `/api/authors/${editingAuthor.id}` : '/api/authors'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ name: '', email: '', bio: '', nationality: '', birthYear: '' })
    setShowForm(false)
    setEditingAuthor(null)
    fetchAuthors()
  }

  const handleEdit = (author: Author) => {
    setEditingAuthor(author)
    setForm({ name: author.name, email: author.email, bio: author.bio || '', nationality: author.nationality || '', birthYear: author.birthYear?.toString() || '' })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar autor?')) return
    await fetch(`/api/authors/${id}`, { method: 'DELETE' })
    fetchAuthors()
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px',
    border: '1px solid #d1d5db', fontSize: '0.9rem', outline: 'none',
    boxSizing: 'border-box', background: '#fff', color: '#111'
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <div style={{ background: '#1e3a5f', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-icons" style={{ color: '#60a5fa', fontSize: '28px' }}>menu_book</span>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>Biblioteca</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a href="/books" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.45rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.25)', color: '#e2e8f0', textDecoration: 'none', fontSize: '0.85rem' }}>
            <span className="material-icons" style={{ fontSize: '18px' }}>library_books</span>
            Ver Libros
          </a>
          <button onClick={() => { setShowForm(!showForm); setEditingAuthor(null); setForm({ name: '', email: '', bio: '', nationality: '', birthYear: '' }) }}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.45rem 1rem', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            <span className="material-icons" style={{ fontSize: '18px' }}>person_add</span>
            Nuevo Autor
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>

        {/* Page title */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e3a5f', margin: 0 }}>Gestión de Autores</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>Administra los autores de tu biblioteca</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Autores', value: authors.length, icon: 'people', color: '#2563eb', bg: '#eff6ff' },
            { label: 'Total Libros', value: authors.reduce((s, a) => s + a._count.books, 0), icon: 'book', color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Nacionalidades', value: new Set(authors.map(a => a.nationality).filter(Boolean)).size, icon: 'public', color: '#7c3aed', bg: '#faf5ff' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '1.2rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-icons" style={{ color: s.color, fontSize: '24px' }}>{s.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '3px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: '#1e3a5f', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-icons" style={{ fontSize: '20px', color: '#2563eb' }}>{editingAuthor ? 'edit' : 'person_add'}</span>
              {editingAuthor ? 'Editar Autor' : 'Nuevo Autor'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <input placeholder="Nombre *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ ...input, gridColumn: 'span 2' }} />
              <input placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={input} />
              <input placeholder="Nacionalidad" value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} style={input} />
              <input placeholder="Año de nacimiento" value={form.birthYear} onChange={e => setForm({ ...form, birthYear: e.target.value })} style={input} />
              <textarea placeholder="Biografía" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3}
                style={{ ...input, gridColumn: 'span 2', resize: 'none' } as React.CSSProperties} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button onClick={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#2563eb', color: '#fff', padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                <span className="material-icons" style={{ fontSize: '18px' }}>save</span>
                {editingAuthor ? 'Actualizar' : 'Crear'}
              </button>
              <button onClick={() => setShowForm(false)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', color: '#374151', padding: '0.55rem 1.4rem', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.9rem' }}>
                <span className="material-icons" style={{ fontSize: '18px' }}>close</span>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* List header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{authors.length} autores encontrados</span>
        </div>

        {/* Authors */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '4rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span className="material-icons" style={{ fontSize: '40px', color: '#cbd5e1' }}>hourglass_empty</span>
            <p>Cargando...</p>
          </div>
        ) : authors.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '4rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span className="material-icons" style={{ fontSize: '48px', color: '#cbd5e1' }}>person_off</span>
            <p style={{ marginTop: '0.5rem' }}>No hay autores aún. ¡Crea el primero!</p>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {authors.map((author, idx) => (
              <div key={author.id} style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx < authors.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2563eb', fontSize: '1rem', flexShrink: 0 }}>
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{author.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '3px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748b', fontSize: '0.8rem' }}>
                        <span className="material-icons" style={{ fontSize: '14px' }}>email</span>
                        {author.email}
                      </span>
                      {author.nationality && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748b', fontSize: '0.8rem' }}>
                          <span className="material-icons" style={{ fontSize: '14px' }}>public</span>
                          {author.nationality}
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748b', fontSize: '0.8rem' }}>
                        <span className="material-icons" style={{ fontSize: '14px' }}>book</span>
                        {author._count.books} libros
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <a href={`/authors/${author.id}`} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '0.35rem 0.8rem', borderRadius: '7px', background: '#eff6ff', color: '#2563eb', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, border: '1px solid #bfdbfe' }}>
                    <span className="material-icons" style={{ fontSize: '15px' }}>visibility</span>
                    Ver
                  </a>
                  <button onClick={() => handleEdit(author)} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '0.35rem 0.8rem', borderRadius: '7px', background: '#f8fafc', color: '#374151', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '0.82rem' }}>
                    <span className="material-icons" style={{ fontSize: '15px' }}>edit</span>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(author.id)} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '0.35rem 0.8rem', borderRadius: '7px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer', fontSize: '0.82rem' }}>
                    <span className="material-icons" style={{ fontSize: '15px' }}>delete</span>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}