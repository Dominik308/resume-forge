/**
 * Storage Provider — Local filesystem (dev) or S3 (production)
 * Controlled by USE_LOCAL_STORAGE env variable
 * S3 code is KEPT for VPS deployment — DO NOT REMOVE
 */

import path from 'path'
import fs from 'fs/promises'

// ─── Local Storage ────────────────────────────────────────────────────────────

async function saveFileLocal(
  buffer: Buffer,
  filename: string,
  userId: string,
  subfolder = 'general'
): Promise<string> {
  const uploadDir = process.env.LOCAL_UPLOAD_DIR ?? './public/uploads'
  const userDir = path.join(process.cwd(), uploadDir.replace(/^\.\//, ''), userId, subfolder)
  await fs.mkdir(userDir, { recursive: true })

  const safeFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filePath = path.join(userDir, safeFilename)
  await fs.writeFile(filePath, buffer)

  // Return a public URL path
  return `/uploads/${userId}/${subfolder}/${safeFilename}`
}

async function deleteFileLocal(publicPath: string): Promise<void> {
  const fullPath = path.join(process.cwd(), 'public', publicPath)
  await fs.unlink(fullPath).catch(() => { /* ignore if not found */ })
}

// ─── S3 Storage ───────────────────────────────────────────────────────────────
// Kept for VPS deployment — DO NOT REMOVE

async function saveFileS3(
  buffer: Buffer,
  filename: string,
  userId: string,
  subfolder = 'general'
): Promise<string> {
  // Dynamically import AWS SDK only when needed (not installed locally)
  // @aws-sdk/client-s3 is a VPS-only dependency — DO NOT REMOVE this block
  try {
    // @ts-ignore — AWS SDK intentionally not installed locally; required on VPS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { S3Client, PutObjectCommand } = await import(/* webpackIgnore: true */ '@aws-sdk/client-s3') as any
    const s3 = new S3Client({
      region: process.env.S3_REGION ?? 'eu-central-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ?? '',
        secretAccessKey: process.env.S3_SECRET_KEY ?? '',
      },
    })
    const key = `uploads/${userId}/${subfolder}/${Date.now()}-${filename}`
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: buffer,
      })
    )
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`
  } catch {
    throw new Error('S3 upload failed — check AWS SDK installation and credentials')
  }
}

// ─── Main Exports ─────────────────────────────────────────────────────────────

export async function saveFile(
  buffer: Buffer,
  filename: string,
  userId: string,
  subfolder?: string
): Promise<string> {
  if (process.env.USE_LOCAL_STORAGE === 'true') {
    return saveFileLocal(buffer, filename, userId, subfolder)
  }
  return saveFileS3(buffer, filename, userId, subfolder)
}

export async function deleteFile(publicPath: string): Promise<void> {
  if (process.env.USE_LOCAL_STORAGE === 'true') {
    return deleteFileLocal(publicPath)
  }
  // TODO (VPS): Add S3 delete implementation here
}

export function getStorageType(): 'local' | 's3' {
  return process.env.USE_LOCAL_STORAGE === 'true' ? 'local' : 's3'
}
