/** @format */

import { blogs } from '@/lib/data'
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

type BlogQuery = {
  keyword: string
  pageNo: number
  pageSize: number
}

function getBlogQuery(request: NextRequest): BlogQuery {
  const searchParams = request.nextUrl.searchParams
  const pageNo = Number(searchParams.get('pageNo') || 1)
  const pageSize = Number(searchParams.get('pageSize') || 20)

  return {
    keyword: searchParams.get('keyword')?.trim().toLowerCase() || '',
    pageNo: Number.isFinite(pageNo) && pageNo > 0 ? pageNo : 1,
    pageSize:
      Number.isFinite(pageSize) && pageSize > 0 ? pageSize : blogs.length,
  }
}

export async function GET(request: NextRequest) {
  const { keyword, pageNo, pageSize } = getBlogQuery(request)

  const filteredBlogs = keyword
    ? blogs.filter(blog =>
        [blog.title, blog.des, blog.creatorName]
          .filter(Boolean)
          .some(text => text?.toLowerCase().includes(keyword)),
      )
    : blogs

  const start = (pageNo - 1) * pageSize
  const end = start + pageSize

  return NextResponse.json(filteredBlogs.slice(start, end))
}
