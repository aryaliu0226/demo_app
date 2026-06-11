/** @format */

import { NextRequest, NextResponse } from 'next/server'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { writeFile, readFile, unlink } from 'fs/promises'
import { tmpdir } from 'os'
import path from 'path'
import { randomUUID } from 'crypto'

const execFileAsync = promisify(execFile)

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: '未收到文件' }, { status: 400 })
  }

  const id = randomUUID()
  const inputPath = path.join(tmpdir(), `${id}.heic`)
  const outputPath = path.join(tmpdir(), `${id}.jpg`)

  try {
    // 写临时文件
    await writeFile(inputPath, Buffer.from(await file.arrayBuffer()))

    // macOS 内置 sips，原生支持所有 HEIC 变体
    await execFileAsync('sips', [
      '-s', 'format', 'jpeg',
      '-s', 'formatOptions', '85',
      inputPath,
      '--out', outputPath,
    ])

    const jpeg = await readFile(outputPath)
    const jpegName = file.name
      .replace(/\.heic$/i, '.jpg')
      .replace(/\.heif$/i, '.jpg')

    return new NextResponse(new Uint8Array(jpeg), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `inline; filename="${jpegName}"`,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[convert-heic]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  } finally {
    // 清理临时文件
    await unlink(inputPath).catch(() => {})
    await unlink(outputPath).catch(() => {})
  }
}
