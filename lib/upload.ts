/** @format */

/* ── HEIC → JPEG：发给服务端用 sharp 转换 ───────────────────── */
export async function normalizeImage(file: File): Promise<File> {
  const isHeic =
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    /\.heic$/i.test(file.name) ||
    /\.heif$/i.test(file.name)

  if (!isHeic) return file

  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/convert-heic', { method: 'POST', body: fd })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`HEIC 转换失败: ${body?.error ?? res.status}`)
  }

  const blob = await res.blob()
  const jpegName = file.name
    .replace(/\.heic$/i, '.jpg')
    .replace(/\.heif$/i, '.jpg')
  return new File([blob], jpegName, { type: 'image/jpeg' })
}

/* ── OSS 直传：向 /api/presign 取预签名，再 PUT 到 OSS ─────── */
export async function uploadToOSS(file: File): Promise<string> {
  const res = await fetch('/api/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, fileType: file.type }),
  })

  if (!res.ok) throw new Error('获取签名失败')
  const { uploadUrl, publicUrl } = (await res.json()) as {
    uploadUrl: string
    publicUrl: string
  }

  const putRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!putRes.ok) throw new Error('上传 OSS 失败')

  return publicUrl
}
