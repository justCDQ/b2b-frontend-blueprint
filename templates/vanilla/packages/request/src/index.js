export function createHttpClient({
  baseUrl = "",
  getToken,
  fetchImpl = globalThis.fetch,
  timeoutMs = 15000,
  headers = {},
  onUnauthorized,
  onForbidden
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
    const { query, timeoutMs: _timeoutMs, ...fetchOptions } = options;

    try {
      const response = await fetchImpl(resolveUrl(baseUrl, path, query), {
        ...fetchOptions,
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

      return await parseResponse(response);
    } catch (error) {
      if (error.name === "AbortError") {
        throw createRequestError({
          code: "REQUEST_TIMEOUT",
          message: "Request timed out.",
          status: 0
        });
      }

      const normalizedError = normalizeRequestError(error);

      if (normalizedError.status === 401) {
        onUnauthorized?.(normalizedError);
      }

      if (normalizedError.status === 403) {
        onForbidden?.(normalizedError);
      }

      throw normalizedError;
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

export function createResourceApi({
  client,
  endpoint,
  idKey = "id",
  adaptList = adaptPageResponse,
  paths = {}
}) {
  if (!client) {
    throw new Error("createResourceApi requires a client.");
  }

  if (!endpoint) {
    throw new Error("createResourceApi requires an endpoint.");
  }

  const basePath = endpoint.replace(/\/$/, "");

  return {
    async query(query) {
      const response = await client.get(paths.query || basePath, { query });
      return adaptList(response);
    },
    create(input) {
      return client.post(paths.create || basePath, input);
    },
    update(id, patch) {
      return client.patch(paths.update?.(id) || `${basePath}/${encodeURIComponent(id)}`, patch);
    },
    delete(id) {
      return client.delete(paths.delete?.(id) || `${basePath}/${encodeURIComponent(id)}`);
    },
    get(recordOrId) {
      const id = typeof recordOrId === "object" ? recordOrId[idKey] : recordOrId;
      return client.get(paths.get?.(id) || `${basePath}/${encodeURIComponent(id)}`);
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
  pageSizeKey = "pageSize",
  rootKey = ""
} = {}) {
  const source = rootKey ? getPathValue(response, rootKey) : response;
  const fallbackSource = source?.data || source;
  const list = getPathValue(fallbackSource, listKey) ?? getPathValue(response, listKey) ?? [];
  const total = getPathValue(fallbackSource, totalKey) ?? getPathValue(response, totalKey) ?? list.length;
  const pageNum = getPathValue(fallbackSource, pageNumKey) ?? getPathValue(response, pageNumKey) ?? 1;
  const pageSize = getPathValue(fallbackSource, pageSizeKey) ?? getPathValue(response, pageSizeKey) ?? (list.length || 20);

  return {
    list,
    pageNum,
    pageSize,
    total
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

function getPathValue(source, path) {
  if (!path) return source;
  return String(path).split(".").reduce((value, key) => {
    if (value === undefined || value === null) return undefined;
    return value[key];
  }, source);
}

function resolveUrl(baseUrl, path, query) {
  const isAbsolute = /^https?:\/\//.test(path);
  const hasBase = Boolean(baseUrl);
  const url = isAbsolute
    ? new URL(path)
    : new URL(
      hasBase ? `${baseUrl.replace(/\/$/, "")}/${String(path).replace(/^\//, "")}` : String(path).replace(/^\//, ""),
      "http://blueprint.local"
    );

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    }
  }

  if (!isAbsolute && !hasBase) {
    return `${url.pathname}${url.search}`;
  }

  return url.toString();
}
