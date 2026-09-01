import type { DataHolder } from "@/models/data-holder"

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
    let response: Response

    try {
      response = await fetch(this.buildUrl(path), {
        ...options,
        headers: {
          Accept: "application/json",
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers,
        },
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to reach the server"
      throw new Error(`Unable to reach the server: ${message}`, {
        cause: error,
      })
    }

    return this.parseDataHolder<T>(response)
  }

  private buildUrl(path: string): string {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    return `${this.baseUrl}${normalizedPath}`
  }

  private async parseDataHolder<T>(response: Response): Promise<DataHolder<T>> {
    if (response.status === 204) {
      throw new Error("The server returned no DataHolder response")
    }

    const contentType = response.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      throw new Error("The server returned a non-JSON response")
    }

    const responseBody: unknown = await response.json()

    if (!this.isDataHolder<T>(responseBody)) {
      throw new Error("The server returned an invalid DataHolder response")
    }

    return responseBody
  }

  private isDataHolder<T>(value: unknown): value is DataHolder<T> {
    if (!value || typeof value !== "object") {
      return false
    }

    const candidate = value as Record<string, unknown>
    return (
      "data" in candidate &&
      typeof candidate.status_code === "number" &&
      (typeof candidate.message === "string" || candidate.message === null)
    )
  }
}

export const httpService = new HttpService()
