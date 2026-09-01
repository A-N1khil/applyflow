import type { DataHolder } from "@/models/data-holder"

interface ApiErrorBody {
  detail?: unknown
  message?: unknown
}

export class HttpService {
  public readonly baseUrl: string

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "")
  }

  get<T>(path: string): Promise<DataHolder<T>> {
    return this.request<T>(path, { method: "GET" })
  }

  post<TResponse, TRequest = unknown>(
    path: string,
    body: TRequest
  ): Promise<DataHolder<TResponse>> {
    return this.request<TResponse>(path, {
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  patch<TResponse, TRequest = unknown>(
    path: string,
    body: TRequest
  ): Promise<DataHolder<TResponse>> {
    return this.request<TResponse>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    })
  }

  delete<T = null>(path: string): Promise<DataHolder<T>> {
    return this.request<T>(path, { method: "DELETE" })
  }

  private async request<T>(
    path: string,
    options: RequestInit
  ): Promise<DataHolder<T>> {
    try {
      const response = await fetch(this.buildUrl(path), {
        ...options,
        headers: {
          Accept: "application/json",
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers,
        },
      })
      const responseBody = await this.parseResponse(response)

      if (!response.ok) {
        return {
          data: null,
          status: response.status,
          messages: this.getErrorMessage(responseBody, response.statusText),
        }
      }

      return {
        data: responseBody as T | null,
        status: response.status,
        messages: null,
      }
    } catch (error: unknown) {
      return {
        data: null,
        status: 0,
        messages:
          error instanceof Error ? error.message : "Unable to reach the server",
      }
    }
  }

  private buildUrl(path: string): string {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    return `${this.baseUrl}${normalizedPath}`
  }

  private async parseResponse(response: Response): Promise<unknown> {
    if (response.status === 204) {
      return null
    }

    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      return response.json()
    }

    const responseText = await response.text()
    return responseText || null
  }

  private getErrorMessage(body: unknown, fallbackMessage: string): string {
    if (typeof body === "string") {
      return body
    }

    if (body && typeof body === "object") {
      const errorBody = body as ApiErrorBody

      if (typeof errorBody.detail === "string") {
        return errorBody.detail
      }

      if (Array.isArray(errorBody.detail)) {
        return errorBody.detail
          .map((detail) =>
            detail && typeof detail === "object" && "msg" in detail
              ? String(detail.msg)
              : String(detail)
          )
          .join(", ")
      }

      if (typeof errorBody.message === "string") {
        return errorBody.message
      }
    }

    return fallbackMessage || "The request failed"
  }
}

export const httpService = new HttpService()
