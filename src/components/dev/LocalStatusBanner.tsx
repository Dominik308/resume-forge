'use client'

import { useEffect, useState } from 'react'

interface HealthStatus {
  status: 'ok' | 'degraded' | 'error'
  database: { connected: boolean; error?: string }
  llm: {
    provider: string
    ready: boolean
    ollama: { running: boolean; models: string[]; selectedModel: string; error?: string }
  }
  storage: { type: string; writable: boolean }
}

// Only renders in development mode — safe to keep in codebase for VPS

export function LocalStatusBanner() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    fetch('/api/health')
      .then((r) => r.json() as Promise<HealthStatus>)
      .then(setHealth)
      .catch(() => setHealth(null))
  }, [])

  if (process.env.NODE_ENV !== 'development' || !visible || !health) return null

  const Dot = ({ ok }: { ok: boolean }) => (
    <span
      className={`inline-block w-2 h-2 rounded-full mr-1.5 flex-shrink-0 ${ok ? 'bg-green-400' : 'bg-red-400'}`}
    />
  )

  const selectedModel = health.llm?.ollama?.selectedModel ?? ''
  const modelInstalled = health.llm?.ollama?.models?.some((m) =>
    m.includes(selectedModel.split(':')[0])
  )

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white text-xs rounded-lg shadow-2xl border border-gray-700 max-w-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <span className="font-bold text-green-400">⚙ Local Dev Status</span>
        <div className="flex gap-2 ml-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition-colors"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '▲' : '▼'}
          </button>
          <button
            onClick={() => setVisible(false)}
            className="text-gray-400 hover:text-white transition-colors"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="px-3 py-2 space-y-1.5">
          {/* Database */}
          <div className="flex items-center">
            <Dot ok={health.database?.connected ?? false} />
            <span className="truncate">
              PostgreSQL:{' '}
              {health.database?.connected ? (
                <span className="text-green-400">Connected</span>
              ) : (
                <span className="text-red-400">
                  {health.database?.error ?? 'Disconnected'}
                </span>
              )}
            </span>
          </div>

          {/* LLM */}
          <div className="flex items-center">
            <Dot ok={health.llm?.ready ?? false} />
            <span className="truncate">
              Ollama:{' '}
              {health.llm?.ollama?.running ? (
                <span className="text-green-400">{selectedModel} ✓</span>
              ) : (
                <span className="text-red-400">Not running!</span>
              )}
            </span>
          </div>

          {/* Ollama hints */}
          {health.llm?.provider === 'ollama' && !health.llm.ollama.running && (
            <div className="text-yellow-400 pl-3.5 text-[10px] leading-relaxed">
              Start Ollama, then run:
              <br />
              <code className="bg-gray-800 px-1 rounded">
                ollama pull {selectedModel}
              </code>
            </div>
          )}
          {health.llm?.provider === 'ollama' &&
            health.llm.ollama.running &&
            !modelInstalled && (
              <div className="text-yellow-400 pl-3.5 text-[10px] leading-relaxed">
                Model not installed! Run:
                <br />
                <code className="bg-gray-800 px-1 rounded">
                  ollama pull {selectedModel}
                </code>
              </div>
            )}

          {/* Storage */}
          <div className="flex items-center">
            <Dot ok={health.storage?.writable ?? false} />
            <span>
              Storage: {health.storage?.type}{' '}
              {health.storage?.writable ? (
                <span className="text-green-400">✓</span>
              ) : (
                <span className="text-red-400">✗</span>
              )}
            </span>
          </div>

          {/* Status bar */}
          <div
            className={`text-center py-0.5 rounded text-[10px] mt-1 ${
              health.status === 'ok'
                ? 'bg-green-900 text-green-300'
                : 'bg-yellow-900 text-yellow-300'
            }`}
          >
            {health.status === 'ok'
              ? '✅ All systems ready'
              : '⚠ Some services need attention'}
          </div>
        </div>
      )}
    </div>
  )
}
