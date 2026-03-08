import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkOllamaHealth } from '@/lib/ai/llm-provider'
import { getStorageType } from '@/lib/storage'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  const [dbStatus, ollamaStatus, storageStatus] = await Promise.allSettled([
    // Database check
    prisma.$queryRaw`SELECT 1`.then(() => ({ connected: true })),
    // Ollama check
    checkOllamaHealth(),
    // Storage check
    (async () => {
      const storageType = getStorageType()
      if (storageType === 'local') {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        await fs.mkdir(uploadDir, { recursive: true })
        return { type: 'local', path: uploadDir, writable: true }
      }
      return {
        type: 's3',
        bucket: process.env.S3_BUCKET ?? '',
        writable: !!(process.env.S3_ACCESS_KEY),
      }
    })(),
  ])

  const db =
    dbStatus.status === 'fulfilled'
      ? dbStatus.value
      : { connected: false, error: String((dbStatus as PromiseRejectedResult).reason) }

  const ollama =
    ollamaStatus.status === 'fulfilled'
      ? ollamaStatus.value
      : { running: false, models: [], selectedModel: '', error: 'Health check failed' }

  const storage =
    storageStatus.status === 'fulfilled'
      ? storageStatus.value
      : { type: 'unknown', writable: false }

  const llmReady = (ollama as { running: boolean }).running
  const dbConnected = (db as { connected: boolean }).connected
  const allHealthy = dbConnected && llmReady

  return NextResponse.json(
    {
      status: allHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: db,
      llm: {
        provider: 'ollama',
        ollama,
        ready: llmReady,
      },
      storage,
      features: {
        pdfExport: true,
        webScraper: true,
        puppeteer: process.env.USE_PUPPETEER === 'true',
        oauthGoogle: !!(
          process.env.GOOGLE_CLIENT_ID &&
          !process.env.GOOGLE_CLIENT_ID.includes('your-')
        ),
        oauthGithub: !!(
          process.env.GITHUB_CLIENT_ID &&
          !process.env.GITHUB_CLIENT_ID.includes('your-')
        ),
      },
    },
    { status: allHealthy ? 200 : 207 }
  )
}
