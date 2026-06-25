export function createHttpClient({
  baseUrl = "",
  getToken,
  fetchImpl = globalThis.fetch,
  timeoutMs = 15000,
  headers = {}
} = {}) {
  if (typeof fetchImpl !== "function") {
    throw new Error("createHttpClient requires a fetch implementation.");
  }

  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? timeoutMs);
    const token = await getToken?.();
    const method = options.method || "GET";
    const body = normalizeBody(options.body);

    try {
      const response = await fetchImpl(resolveUrl(baseUrl, path), {
        ...options,
        method,
        body,
        headers: {
          Accept: "application/json",
          ...(body ? { "Content-Type": "application/json" } : {}),
          ...headers,
          ...options.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        signal: options.signal || controller.signal
      });

      return parseResponse(response);
    } catch (error) {
      if (error.name === "AbortError") {
        throw createRequestError({
          code: "REQUEST_TIMEOUT",
          message: "Request timed out.",
          status: 0
        });
      }

      throw normalizeRequestError(error);
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    request,
    get(path, options) {
      return request(path, { ...options, method: "GET" });
    },
    post(path, body, options) {
      return request(path, { ...options, body, method: "POST" });
    },
    put(path, body, options) {
      return request(path, { ...options, body, method: "PUT" });
    },
    patch(path, body, options) {
      return request(path, { ...options, body, method: "PATCH" });
    },
    delete(path, options) {
      return request(path, { ...options, method: "DELETE" });
    }
  };
}

export function createMockClient(handlers = {}) {
  return {
    async request(path, options = {}) {
      const method = options.method || "GET";
      const key = `${method.toUpperCase()} ${path}`;
      const handler = handlers[key] || handlers[path];

      if (!handler) {
        throw createRequestError({
          code: "MOCK_HANDLER_NOT_FOUND",
          message: `No mock handler for ${key}.`,
          status: 404
        });
      }

      return handler(options);
    },
    get(path, options) {
      return this.request(path, { ...options, method: "GET" });
    },
    post(path, body, options) {
      return this.request(path, { ...options, body, method: "POST" });
    },
    put(path, body, options) {
      return this.request(path, { ...options, body, method: "PUT" });
    },
    patch(path, body, options) {
      return this.request(path, { ...options, body, method: "PATCH" });
    },
    delete(path, options) {
      return this.request(path, { ...options, method: "DELETE" });
    }
  };
}

export function adaptPageResponse(response, {
  listKey = "list",
  totalKey = "total",
  pageNumKey = "pageNum",
  pageSizeKey = "pageSize"
} = {}) {
  return {
    list: response[listKey] || [],
    pageNum: response[pageNumKey] || 1,
    pageSize: response[pageSizeKey] || 20,
    total: response[totalKey] || 0
  };
}

export function createRequestError({ code, message, status, details }) {
  const error = new Error(message || code || "Request failed.");
  error.code = code || "REQUEST_ERROR";
  error.status = status || 0;
  error.details = details;
  return error;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw createRequestError({
      code: payload?.code || `HTTP_${response.status}`,
      message: payload?.message || response.statusText,
      status: response.status,
      details: payload
    });
  }

  return payload;
}

function normalizeBody(body) {
  if (body === undefined || body === null) return undefined;
  if (typeof body === "string" || body instanceof FormData) return body;
  return JSON.stringify(body);
}

function normalizeRequestError(error) {
  if (error.code && error.status !== undefined) return error;

  return createRequestError({
    code: error.code || "NETWORK_ERROR",
    message: error.message || "Network request failed.",
    status: error.status || 0,
    details: error.details
  });
}

function resolveUrl(baseUrl, path) {
  if (/^https?:\/\//.test(path)) return path;
  return `${baseUrl.replace(/\/$/, "")}/${String(path).replace(/^\//, "")}`;
}
