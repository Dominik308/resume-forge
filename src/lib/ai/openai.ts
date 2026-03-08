/**
 * AI Module — Routes through the Ollama LLM provider layer.
 * 100% local & private. No external API calls.
 */

// Re-export from the abstract provider for external consumers
export { callLLM, callLLMSimple, callLLMJSON, checkOllamaHealth } from './llm-provider'

import { callLLMSimple, callLLMJSON as _callLLMJSON } from './llm-provider'

export const AI_MODEL = process.env.OLLAMA_MODEL ?? 'llama3.2'

/**
 * Call AI with system prompt and user message.
 * Routes through Ollama for local AI processing.
 */
export async function callAI(
  systemPrompt: string,
  userMessage: string,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  return callLLMSimple(userMessage, systemPrompt, options)
}

/**
 * Call AI and parse response as JSON.
 * Routes through Ollama for local AI processing.
 */
export async function callAIJSON<T>(
  systemPrompt: string,
  userMessage: string,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<T> {
  return _callLLMJSON<T>(userMessage, systemPrompt, options)
}

/**
 * Streaming AI — uses Ollama native streaming.
 */
export async function streamAI(
  systemPrompt: string,
  userMessage: string
): Promise<AsyncIterable<string>> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'
  const model = process.env.OLLAMA_MODEL ?? 'llama3.2'

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      stream: true,
    }),
    signal: AbortSignal.timeout(120_000),
  })

  if (!response.ok || !response.body) {
    // Fallback to non-streaming
    const result = await callLLMSimple(userMessage, systemPrompt)
    async function* generateTokens() {
      yield result
    }
    return generateTokens()
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  async function* generateTokens() {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value, { stream: true })
      const lines = text.split('\n').filter(Boolean)
      for (const line of lines) {
        try {
          const json = JSON.parse(line) as { message?: { content?: string }; done?: boolean }
          if (json.message?.content) yield json.message.content
        } catch {
          // Skip malformed lines
        }
      }
    }
  }

  return generateTokens()
}
