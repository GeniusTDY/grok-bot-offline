export const CLI_PROXY_DEFAULT_BASE_URL = "http://127.0.0.1:20128/v1";
export const CLI_PROXY_DEFAULT_MODEL = "";
export const CLI_PROXY_MAX_BASE_URL_LENGTH = 2_048;
export const CLI_PROXY_MAX_MODEL_LENGTH = 256;
export const CLI_PROXY_MAX_API_KEY_LENGTH = 8_192;
export const CLI_PROXY_MAX_MODELS = 500;
export const CLI_PROXY_MAX_JSON_BYTES = 2 * 1024 * 1024;
export const CLI_PROXY_MAX_STREAM_BYTES = 32 * 1024 * 1024;
export const CLI_PROXY_REQUEST_TIMEOUT_MS = 120_000;
export const CLI_PROXY_PERSISTED_CHANNEL = "sand:cli-proxy-persisted";

export const CLI_PROXY_PROTOCOLS = ["auto", "chat-completions", "responses"] as const;
export type CliProxyProtocol = (typeof CLI_PROXY_PROTOCOLS)[number];

export interface CliProxyPublicConfig {
  readonly baseUrl: string;
  readonly model: string;
  readonly protocol: CliProxyProtocol;
  readonly allowRemoteHttps: boolean;
  readonly allowTailscaleHttp: boolean;
}

export interface CliProxyTurnConfig extends CliProxyPublicConfig {
  readonly apiKey: string;
}

export interface CliProxySaveRequest extends CliProxyPublicConfig {
  readonly apiKey?: string;
}

export interface CliProxyStatus extends CliProxyPublicConfig {
  readonly configured: boolean;
  readonly isPersistent: boolean;
  readonly probe?: {
    readonly outcome: "ok" | "empty";
    readonly models: readonly string[];
    readonly latencyMs: number;
    readonly message: string;
  };
}

export const CLI_PROXY_DEFAULT_CONFIG: CliProxyPublicConfig = {
  baseUrl: CLI_PROXY_DEFAULT_BASE_URL,
  model: CLI_PROXY_DEFAULT_MODEL,
  protocol: "chat-completions",
  allowRemoteHttps: false,
  allowTailscaleHttp: false,
};

export function normalizeCliProxyBaseUrl(raw: unknown, allowRemoteHttps: boolean, allowTailscaleHttp = false): string {
  if (typeof raw !== "string") throw new Error("9Router Base URL must be a string.");
  const value = raw.trim();
  if (value.length === 0 || value.length > CLI_PROXY_MAX_BASE_URL_LENGTH || /[\u0000-\u001f\u007f]/.test(value)) {
    throw new Error("9Router Base URL is empty, too long, or contains control characters.");
  }
  let parsed: URL;
  try { parsed = new URL(value); }
  catch { throw new Error("9Router Base URL is not a valid URL."); }
  if (parsed.username.length > 0 || parsed.password.length > 0 || parsed.search.length > 0 || parsed.hash.length > 0) {
    throw new Error("9Router Base URL cannot contain credentials, a query, or a fragment.");
  }
  if (parsed.hostname.toLowerCase() === "host.docker.internal") {
    throw new Error("host.docker.internal is not allowed as a 9Router endpoint.");
  }
  // NOTE: the loopback / Tailscale-only HTTP restriction and the strict /v1
  // root check have both been relaxed so any remote HTTP(S) OpenAI-compatible
  // endpoint may be used, including endpoints with custom path prefixes.
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("9Router Base URL must use HTTP or HTTPS.");
  }
  const pathname = parsed.pathname.replace(/\/+$/, "") || "/v1";
  parsed.pathname = pathname;
  return parsed.toString().replace(/\/$/, "");
}

export function normalizeCliProxyPublicConfig(raw: unknown): CliProxyPublicConfig {
  const record = typeof raw === "object" && raw != null && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const allowRemoteHttps = record.allowRemoteHttps === true;
  const allowTailscaleHttp = record.allowTailscaleHttp === true;
  const model = typeof record.model === "string" ? record.model.trim() : "";
  if (model.length > CLI_PROXY_MAX_MODEL_LENGTH || /[\u0000-\u001f\u007f]/.test(model)) {
    throw new Error("9Router model must be at most 256 characters without control characters.");
  }
  const protocol = record.protocol;
  if (typeof protocol !== "string" || !(CLI_PROXY_PROTOCOLS as readonly string[]).includes(protocol)) {
    throw new Error("Unknown 9Router API protocol.");
  }
  return {
    baseUrl: normalizeCliProxyBaseUrl(record.baseUrl, allowRemoteHttps, allowTailscaleHttp),
    model,
    protocol: protocol as CliProxyProtocol,
    allowRemoteHttps,
    allowTailscaleHttp,
  };
}

export function requireCliProxyModel(raw: unknown): string {
  if (typeof raw !== "string") throw new Error("Choose a 9Router model in Settings → Router.");
  const value = raw.trim();
  if (value.length === 0 || value.length > CLI_PROXY_MAX_MODEL_LENGTH || /[\u0000-\u001f\u007f]/.test(value)) {
    throw new Error("Choose a valid 9Router model in Settings → Router.");
  }
  return value;
}

export function normalizeCliProxyApiKey(raw: unknown): string {
  if (typeof raw !== "string") throw new Error("9Router API key must be a string.");
  const value = raw.trim();
  if (value.length === 0 || value.length > CLI_PROXY_MAX_API_KEY_LENGTH || /[\u0000-\u001f\u007f]/.test(value)) {
    throw new Error("9Router API key is empty, too long, or contains control characters.");
  }
  return value;
}

/**
 * Pure validation for a renderer save request. Callers may run this before any
 * credential-revocation fence so malformed input cannot disrupt an active turn.
 */
export function normalizeCliProxySaveRequest(raw: unknown): CliProxySaveRequest {
  const record = typeof raw === "object" && raw != null && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const config = normalizeCliProxyPublicConfig(record);
  return {
    ...config,
    ...(record.apiKey === undefined ? {} : { apiKey: normalizeCliProxyApiKey(record.apiKey) }),
  };
}

export function normalizeCliProxyTurnConfig(raw: unknown): CliProxyTurnConfig {
  const record = typeof raw === "object" && raw != null && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const config = normalizeCliProxyPublicConfig(record);
  return { ...config, model: requireCliProxyModel(config.model), apiKey: normalizeCliProxyApiKey(record.apiKey) };
}

export function cliProxyEndpoint(config: CliProxyPublicConfig, endpoint: "chat/completions" | "responses" | "models"): string {
  const base = normalizeCliProxyBaseUrl(config.baseUrl, config.allowRemoteHttps, config.allowTailscaleHttp);
  return `${base}/${endpoint}`;
}
