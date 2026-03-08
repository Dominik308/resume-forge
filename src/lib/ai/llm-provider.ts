/**
 * LLM Provider Layer — Ollama (100% Local & Private)
 * All AI processing runs on your machine via Ollama.
 * No data ever leaves your computer.
 */

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface LLMResponse {
  content: string
  provider: 'ollama'
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// ─── Ollama ──────────────────────────────────────────────────────────────────

async function callOllama(
  messages: LLMMessage[],
  options?: LLMOptions
): Promise<LLMResponse> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'
  const model = options?.model ?? process.env.OLLAMA_MODEL ?? 'llama3.2'

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: {
        temperature: options?.temperature ?? 0.7,
        num_predict: options?.maxTokens ?? 2048,
      },
    }),
    signal: AbortSignal.timeout(120_000), // 2 min timeout for local LLM
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Ollama error ${response.status}: ${error}`)
  }

  const data = await response.json() as {
    message: { content: string }
    prompt_eval_count?: number
    eval_count?: number
  }

  return {
    content: data.message.content,
    provider: 'ollama',
    model,
    usage: {
      promptTokens: data.prompt_eval_count ?? 0,
      completionTokens: data.eval_count ?? 0,
      totalTokens: (data.prompt_eval_count ?? 0) + (data.eval_count ?? 0),
    },
  }
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export async function callLLM(
  messages: LLMMessage[],
  options?: LLMOptions
): Promise<LLMResponse> {
  return callOllama(messages, options)
}

/** Convenience wrapper for simple prompt/response (no chat history needed) */
export async function callLLMSimple(
  prompt: string,
  systemPrompt?: string,
  options?: LLMOptions
): Promise<string> {
  const messages: LLMMessage[] = []
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
  messages.push({ role: 'user', content: prompt })
  const response = await callLLM(messages, options)
  return response.content
}

/** Like callLLMSimple but returns parsed JSON — use for structured output */
export async function callLLMJSON<T>(
  prompt: string,
  systemPrompt?: string,
  options?: LLMOptions
): Promise<T> {
  const jsonSystemPrompt = (systemPrompt ?? '') +
    '\nRespond ONLY with valid JSON. Do not include any explanation outside of the JSON object.'
  const content = await callLLMSimple(prompt, jsonSystemPrompt, {
    temperature: options?.temperature ?? 0.3,
    ...options,
  })

  // Extract JSON from the response (handles markdown code blocks)
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ??
                    content.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
  const jsonStr = jsonMatch ? (jsonMatch[1] ?? jsonMatch[0]) : content

  return JSON.parse(jsonStr.trim()) as T
}

// ─── Health & Discovery ───────────────────────────────────────────────────────

export async function checkOllamaHealth(): Promise<{
  running: boolean
  models: string[]
  selectedModel: string
  error?: string
}> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'
  const selectedModel = process.env.OLLAMA_MODEL ?? 'llama3.2'

  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    })
    if (!response.ok) throw new Error(`Status ${response.status}`)

    const data = await response.json() as {
      models: Array<{ name: string }>
    }
    const models = data.models.map((m) => m.name)

    return { running: true, models, selectedModel }
  } catch (err) {
    return {
      running: false,
      models: [],
      selectedModel,
      error: err instanceof Error ? err.message : 'Cannot reach Ollama',
    }
  }
}


