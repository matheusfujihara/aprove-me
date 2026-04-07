import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RegisterPage from "@/app/register/page";
import * as api from "@/lib/api";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/api", () => ({
  registerUser: vi.fn(),
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders registration form with inputs and submit button", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("heading", { name: "Criar usuário" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("voce@empresa.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Minimo 6 caracteres")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Criar usuário" })).toBeInTheDocument();
  });

  it("has a link back to the login page", () => {
    render(<RegisterPage />);
    const link = screen.getByRole("link", { name: "Entrar" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/login");
  });

  it("shows validation error when submitting with empty fields", async () => {
    render(<RegisterPage />);
    fireEvent.click(screen.getByRole("button", { name: "Criar usuário" }));
    expect(await screen.findByText("Preencha e-mail e senha.")).toBeInTheDocument();
    expect(api.registerUser).not.toHaveBeenCalled();
  });

  it("shows validation error when password is too short", async () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText("voce@empresa.com"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Minimo 6 caracteres"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Criar usuário" }));
    expect(await screen.findByText("A senha deve ter pelo menos 6 caracteres.")).toBeInTheDocument();
    expect(api.registerUser).not.toHaveBeenCalled();
  });

  it("calls registerUser API and shows success message on valid submit", async () => {
    vi.mocked(api.registerUser).mockResolvedValue(undefined);
    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("voce@empresa.com"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Minimo 6 caracteres"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Criar usuário" }));

    expect(
      await screen.findByText("Usuário criado com sucesso. Faça login para continuar."),
    ).toBeInTheDocument();
    expect(api.registerUser).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
  });

  it("redirects to /login after successful registration", async () => {
    vi.mocked(api.registerUser).mockResolvedValue(undefined);
    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("voce@empresa.com"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Minimo 6 caracteres"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Criar usuário" }));

    await screen.findByText("Usuário criado com sucesso. Faça login para continuar.");
    // Wait for the 900ms setTimeout to fire naturally
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/login"), { timeout: 2000 });
  });

  it("shows error message when registerUser API fails", async () => {
    vi.mocked(api.registerUser).mockRejectedValue(new Error("E-mail já cadastrado."));
    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("voce@empresa.com"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Minimo 6 caracteres"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Criar usuário" }));

    expect(await screen.findByText("E-mail já cadastrado.")).toBeInTheDocument();
  });
});
