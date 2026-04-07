import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "@/app/login/page";
import * as api from "@/lib/api";
import * as auth from "@/lib/auth";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => ({ get: () => null }),
}));

vi.mock("@/lib/api", () => ({
  login: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  setAccessToken: vi.fn(),
  getAccessToken: vi.fn(),
  clearAccessToken: vi.fn(),
  isTokenExpired: vi.fn(),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form with inputs and submit button", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("voce@empresa.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("********")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("has a link to the register page", () => {
    render(<LoginPage />);
    const link = screen.getByRole("link", { name: "Criar usuário" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/register");
  });

  it("shows validation error when submitting with empty fields", async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(await screen.findByText("Preencha e-mail e senha.")).toBeInTheDocument();
    expect(api.login).not.toHaveBeenCalled();
  });

  it("calls login API and redirects to /payables on success", async () => {
    vi.mocked(api.login).mockResolvedValue({ accessToken: "tok-123" });
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("voce@empresa.com"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("********"), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({ email: "user@example.com", password: "secret" });
      expect(auth.setAccessToken).toHaveBeenCalledWith("tok-123");
      expect(mockReplace).toHaveBeenCalledWith("/payables");
    });
  });

  it("shows error message when login API fails", async () => {
    vi.mocked(api.login).mockRejectedValue(new Error("Credenciais inválidas."));
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("voce@empresa.com"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("********"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Credenciais inválidas.")).toBeInTheDocument();
  });

  it("shows loading state while submitting", async () => {
    let resolve: (v: { accessToken: string }) => void;
    vi.mocked(api.login).mockReturnValue(new Promise((res) => { resolve = res; }));
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("voce@empresa.com"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("********"), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("button", { name: "Entrando..." })).toBeDisabled();
    await act(async () => { resolve!({ accessToken: "tok" }); });
  });
});
