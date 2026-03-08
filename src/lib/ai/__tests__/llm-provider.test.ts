/**
 * Tests for the LLM Provider layer.
 * We mock fetch() to avoid requiring a running Ollama instance.
 */

import {
  callLLM,
  callLLMSimple,
  callLLMJSON,
  checkOllamaHealth,
  type LLMMessage,
} from "@/lib/ai/llm-provider";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function mockFetchOk(data: unknown) {
  return jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

function mockFetchError(status: number, body: string) {
  return jest.fn().mockResolvedValue({
    ok: false,
    status,
    text: () => Promise.resolve(body),
  });
}

const OLLAMA_CHAT_RESPONSE = {
  message: { content: "Hello from Ollama!" },
  prompt_eval_count: 10,
  eval_count: 20,
};

/* ─── Tests ──────────────────────────────────────────────────────────────── */

describe("LLM Provider", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("callLLM", () => {
    it("sends correctly formatted request to Ollama", async () => {
      const fetchMock = mockFetchOk(OLLAMA_CHAT_RESPONSE);
      global.fetch = fetchMock;

      const messages: LLMMessage[] = [
        { role: "system", content: "You are helpful." },
        { role: "user", content: "Say hi" },
      ];
      await callLLM(messages);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toContain("/api/chat");
      const body = JSON.parse(init.body);
      expect(body.messages).toEqual(messages);
      expect(body.stream).toBe(false);
    });

    it("returns provider as 'ollama'", async () => {
      global.fetch = mockFetchOk(OLLAMA_CHAT_RESPONSE);
      const result = await callLLM([{ role: "user", content: "hi" }]);
      expect(result.provider).toBe("ollama");
    });

    it("returns content from Ollama response", async () => {
      global.fetch = mockFetchOk(OLLAMA_CHAT_RESPONSE);
      const result = await callLLM([{ role: "user", content: "hi" }]);
      expect(result.content).toBe("Hello from Ollama!");
    });

    it("includes token usage stats", async () => {
      global.fetch = mockFetchOk(OLLAMA_CHAT_RESPONSE);
      const result = await callLLM([{ role: "user", content: "hi" }]);
      expect(result.usage).toEqual({
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30,
      });
    });

    it("respects custom temperature and maxTokens", async () => {
      const fetchMock = mockFetchOk(OLLAMA_CHAT_RESPONSE);
      global.fetch = fetchMock;

      await callLLM([{ role: "user", content: "hi" }], {
        temperature: 0.2,
        maxTokens: 512,
      });

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.options.temperature).toBe(0.2);
      expect(body.options.num_predict).toBe(512);
    });

    it("throws on non-200 response", async () => {
      global.fetch = mockFetchError(500, "Internal server error");
      await expect(callLLM([{ role: "user", content: "hi" }])).rejects.toThrow(
        "Ollama error 500"
      );
    });

    it("handles missing usage fields gracefully", async () => {
      global.fetch = mockFetchOk({
        message: { content: "response without usage" },
      });
      const result = await callLLM([{ role: "user", content: "hi" }]);
      expect(result.usage).toEqual({
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      });
    });
  });

  describe("callLLMSimple", () => {
    it("builds messages from prompt and system prompt", async () => {
      const fetchMock = mockFetchOk(OLLAMA_CHAT_RESPONSE);
      global.fetch = fetchMock;

      await callLLMSimple("Hello", "Be concise");

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.messages).toHaveLength(2);
      expect(body.messages[0]).toEqual({ role: "system", content: "Be concise" });
      expect(body.messages[1]).toEqual({ role: "user", content: "Hello" });
    });

    it("omits system message when no system prompt", async () => {
      const fetchMock = mockFetchOk(OLLAMA_CHAT_RESPONSE);
      global.fetch = fetchMock;

      await callLLMSimple("Hello");

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.messages).toHaveLength(1);
      expect(body.messages[0].role).toBe("user");
    });

    it("returns content string directly", async () => {
      global.fetch = mockFetchOk(OLLAMA_CHAT_RESPONSE);
      const result = await callLLMSimple("Hello");
      expect(result).toBe("Hello from Ollama!");
    });
  });

  describe("callLLMJSON", () => {
    it("parses direct JSON response", async () => {
      global.fetch = mockFetchOk({
        message: { content: '{"score": 85, "suggestions": ["improve formatting"]}' },
      });

      const result = await callLLMJSON<{ score: number; suggestions: string[] }>("Analyze this");
      expect(result.score).toBe(85);
      expect(result.suggestions).toEqual(["improve formatting"]);
    });

    it("extracts JSON from markdown code blocks", async () => {
      global.fetch = mockFetchOk({
        message: {
          content: 'Here is the result:\n```json\n{"name": "John", "skills": ["React"]}\n```',
        },
      });

      const result = await callLLMJSON<{ name: string; skills: string[] }>("Parse this");
      expect(result.name).toBe("John");
      expect(result.skills).toEqual(["React"]);
    });

    it("extracts JSON object from surrounded text", async () => {
      global.fetch = mockFetchOk({
        message: { content: 'The analysis shows: {"score": 72}. Done!' },
      });

      const result = await callLLMJSON<{ score: number }>("Analyze");
      expect(result.score).toBe(72);
    });

    it("appends JSON instruction to system prompt", async () => {
      const fetchMock = mockFetchOk({
        message: { content: '{"result": "ok"}' },
      });
      global.fetch = fetchMock;

      await callLLMJSON("test", "Be helpful");
      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.messages[0].content).toContain("valid JSON");
    });

    it("uses lower temperature by default for JSON", async () => {
      const fetchMock = mockFetchOk({ message: { content: '{"x": 1}' } });
      global.fetch = fetchMock;

      await callLLMJSON("test");
      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.options.temperature).toBe(0.3);
    });

    it("throws on completely invalid JSON", async () => {
      global.fetch = mockFetchOk({
        message: { content: "This is not JSON at all, just plain text." },
      });

      await expect(callLLMJSON("parse this")).rejects.toThrow();
    });
  });

  describe("checkOllamaHealth", () => {
    it("returns running=true when Ollama responds", async () => {
      global.fetch = mockFetchOk({
        models: [{ name: "llama3.2:latest" }, { name: "codellama:7b" }],
      });

      const health = await checkOllamaHealth();
      expect(health.running).toBe(true);
      expect(health.models).toEqual(["llama3.2:latest", "codellama:7b"]);
    });

    it("returns running=false on network error", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("ECONNREFUSED"));

      const health = await checkOllamaHealth();
      expect(health.running).toBe(false);
      expect(health.error).toContain("ECONNREFUSED");
      expect(health.models).toEqual([]);
    });

    it("returns running=false on non-OK response", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 503,
      });

      const health = await checkOllamaHealth();
      expect(health.running).toBe(false);
      expect(health.error).toContain("503");
    });

    it("includes selected model name", async () => {
      global.fetch = mockFetchOk({ models: [] });

      const health = await checkOllamaHealth();
      expect(health.selectedModel).toBeTruthy();
      expect(typeof health.selectedModel).toBe("string");
    });
  });
});
