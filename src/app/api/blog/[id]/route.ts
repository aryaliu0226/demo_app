/** @format */

import { blogs } from '@/lib/data'
import { NextResponse } from 'next/server'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return NextResponse.json(
      { message: `Blog ${id} not found` },
      { status: 404 },
    )
  }

  return NextResponse.json(blog)
}
