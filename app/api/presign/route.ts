/** @format */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const OSS = require('ali-oss') as new (opts: Record<string, unknown>) => {
  signatureUrl(
    key: string,
    opts: { method: string; expires: number; 'Content-Type': string },
  ): string
}

import { NextRequest } from 'next/server'

const client = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
})

// 1. 前端请求预签名：POST /api/presign，带上文件名和类型
// 2. 后端生成预签名并返回给前端
export async function POST(request: NextRequest) {
  const { fileName, fileType } = (await request.json()) as {
    fileName: string
    fileType: string
  }

  const key = `uploads/${Date.now()}-${fileName}`

  const uploadUrl = client.signatureUrl(key, {
    method: 'PUT',
    expires: 60,
    'Content-Type': fileType,
  })

  const publicUrl = `${process.env.OSS_BASE_URL}/${key}`

  return Response.json({ uploadUrl, publicUrl })
}
