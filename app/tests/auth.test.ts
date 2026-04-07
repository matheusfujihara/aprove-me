import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearAccessToken,
  getAccessToken,
  isTokenExpired,
  setAccessToken,
} from "@/lib/auth";

describe("auth helpers", () => {
  afterEach(() => {
    clearAccessToken();
  });

  it("salva e remove token no localStorage", () => {
    setAccessToken("abc");
    expect(getAccessToken()).toBe("abc");

    clearAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("detecta token expirado", () => {
    const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 10 }));
    const token = `x.${payload}.y`;
    expect(isTokenExpired(token)).toBe(true);
  });

  it("considera token sem exp como nao expirado", () => {
    const payload = btoa(JSON.stringify({ sub: "1" }));
    const token = `x.${payload}.y`;
    expect(isTokenExpired(token)).toBe(false);
  });

  it("retorna false para payload invalido", () => {
    const spy = vi.spyOn(Date, "now").mockReturnValue(Date.now());
    expect(isTokenExpired("token-invalido")).toBe(false);
    spy.mockRestore();
  });
});
