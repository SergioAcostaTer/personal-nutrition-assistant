const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;
type Json = Record<string, unknown> | undefined;

export class HttpClient {
  constructor(private base: string = BASE) {}

  private async request(path: string, init: RequestInit) {
    const res = await fetch(`${this.base}${path}`, {
      ...init,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    });
    if (!res.ok) throw new Error(`${init.method || "GET"} ${path} failed (${res.status})`);
    return res;
  }

  get<T>(path: string): Promise<T> {
    return this.request(path, { method: "GET" }).then(r => r.json());
  }
  post<T>(path: string, body?: Json): Promise<T> {
    return this.request(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }).then(r => r.json());
  }
  patch<T = void>(path: string, body?: Json): Promise<T> {
    return this.request(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }).then(r => r.json().catch(() => (undefined as T)));
  }
  delete(path: string): Promise<void> {
    return this.request(path, { method: "DELETE" }).then(() => undefined);
  }
}
