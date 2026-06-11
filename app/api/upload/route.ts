/** @format */

import { writeFile, mkdir } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { randomUUID } from 'crypto'

// 1. 前端直接上传到后端：POST /api/upload，FormData 里带上文件
// 2. 后端接收文件并保存到 public/uploads，返回访问 URL
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: '未收到文件' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'bin'
  const filename = `${randomUUID()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadDir, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` })
}
