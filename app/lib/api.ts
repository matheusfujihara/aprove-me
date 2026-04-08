import { clearAccessToken, getAccessToken } from "./auth";
import type { Assignor, CreatePayableResponse, LoginResponse, Payable } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/integrations";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function parseErrorMessage(payload: unknown): string {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const candidate = payload as { message?: string | string[] };
    if (Array.isArray(candidate.message)) {
      return candidate.message.join(", ");
    }

    if (typeof candidate.message === "string") {
      return candidate.message;
    }
  }

  return "Unexpected API error.";
}

async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  headers.set("Content-Type", "application/json");

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    clearAccessToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError("Session expired. Login again.", 401);
  }

  if (!response.ok) {
    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    throw new ApiError(parseErrorMessage(payload), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function registerUser(payload: { email: string; password: string }) {
  return apiRequest("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  }, false);
}

export function login(payload: { email: string; password: string }) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  }, false);
}

export function getCurrentUser() {
  return apiRequest<{ sub: string; email: string; iat: number; exp: number }>("/users/me");
}

export function getAssignors() {
  return apiRequest<Assignor[]>("/assignor");
}

export function getAssignorById(id: string) {
  return apiRequest<Assignor>(`/assignor/${id}`);
}

export function createAssignor(payload: {
  document: string;
  email: string;
  phone: string;
  name: string;
}) {
  return apiRequest<Assignor>("/assignor", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPayables() {
  return apiRequest<Payable[]>("/payable");
}

export function getPayableById(id: string) {
  return apiRequest<Payable>(`/payable/${id}`);
}

export function createPayable(payload: {
  payable: { value: number; emissionDate: string };
  assignor: { document: string; email: string; phone: string; name: string };
}) {
  return apiRequest<CreatePayableResponse>("/payable", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updatePayable(
  id: string,
  payload: { value?: number; emissionDate?: string; assignorId?: string },
) {
  return apiRequest<Payable>(`/payable/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deletePayable(id: string) {
  return apiRequest<void>(`/payable/${id}`, {
    method: "DELETE",
  });
}
