import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: true
      }
    })

    if (!author) {
      return NextResponse.json(
        { error: 'Autor no encontrado' },
        { status: 404 }
      )
    }

    const books = author.books

    if (books.length === 0) {
      return NextResponse.json({
        authorId: author.id,
        authorName: author.name,
        totalBooks: 0,
        firstBook: null,
        latestBook: null,
        averagePages: 0,
        genres: [],
        longestBook: null,
        shortestBook: null,
      })
    }

    const sortedByYear = [...books].sort((a, b) => (a.publishedYear || 0) - (b.publishedYear || 0))
    const firstBook = sortedByYear[0]
    const latestBook = sortedByYear[sortedByYear.length - 1]

    const booksWithPages = books.filter((b: any) => b.pages !== null)
    const averagePages = booksWithPages.length > 0
      ? Math.round(booksWithPages.reduce((sum: number, b: any) => sum + (b.pages || 0), 0) / booksWithPages.length)
      : 0

    const genres = [...new Set(books.map(b => b.genre).filter(Boolean))]

    const sortedByPages = [...booksWithPages].sort((a, b) => (b.pages || 0) - (a.pages || 0))
    const longestBook = sortedByPages[0] || null
    const shortestBook = sortedByPages[sortedByPages.length - 1] || null

    return NextResponse.json({
      authorId: author.id,
      authorName: author.name,
      totalBooks: books.length,
      firstBook: firstBook ? { title: firstBook.title, year: firstBook.publishedYear } : null,
      latestBook: latestBook ? { title: latestBook.title, year: latestBook.publishedYear } : null,
      averagePages,
      genres,
      longestBook: longestBook ? { title: longestBook.title, pages: longestBook.pages } : null,
      shortestBook: shortestBook ? { title: shortestBook.title, pages: shortestBook.pages } : null,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}