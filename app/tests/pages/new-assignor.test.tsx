import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NewAssignorPage from "@/app/assignors/new/page";
import * as api from "@/lib/api";
import type { Assignor } from "@/lib/types";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/assignors/new",
}));

vi.mock("@/components/auth-guard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/top-nav", () => ({
  TopNav: () => <nav data-testid="top-nav" />,
}));

vi.mock("@/lib/api", () => ({
  createAssignor: vi.fn(),
}));

const mockAssignor: Assignor = {
  id: "asgn-new",
  document: "123.456.789-09",
  email: "cedente@empresa.com",
  phone: "(11) 9 1234-5678",
  name: "Cedente Teste",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
  deletedAt: null,
};

describe("NewAssignorPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form with document, email, phone and name fields", () => {
    render(<NewAssignorPage />);
    expect(screen.getByRole("heading", { name: "Novo cedente" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("000.000.000-00")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("cedente@empresa.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("(11) 9 1234-5678")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nome do cedente")).toBeInTheDocument();
  });

  it("submit button is disabled when fields are empty", () => {
    render(<NewAssignorPage />);
    expect(screen.getByRole("button", { name: "Cadastrar cedente" })).toBeDisabled();
  });

  it("shows validation errors when submitting with invalid data", async () => {
    render(<NewAssignorPage />);

    // Type invalid document to enable the button visually and trigger onSubmit
    const docInput = screen.getByPlaceholderText("000.000.000-00");
    fireEvent.change(docInput, { target: { value: "111.111.111-11" } });
    fireEvent.change(screen.getByPlaceholderText("cedente@empresa.com"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText("(11) 9 1234-5678"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nome do cedente"), {
      target: { value: "A" },
    });

    const btn = screen.getByRole("button", { name: "Cadastrar cedente" });
    // Force submit via form since button may still be disabled due to invalid input state
    const form = btn.closest("form")!;
    fireEvent.submit(form);

    expect(await screen.findByText("Informe CPF/CNPJ válido.")).toBeInTheDocument();
    expect(api.createAssignor).not.toHaveBeenCalled();
  });

  it("calls createAssignor and redirects on valid submit", async () => {
    vi.mocked(api.createAssignor).mockResolvedValue(mockAssignor);
    render(<NewAssignorPage />);

    fireEvent.change(screen.getByPlaceholderText("000.000.000-00"), {
      target: { value: "123.456.789-09" },
    });
    fireEvent.change(screen.getByPlaceholderText("cedente@empresa.com"), {
      target: { value: "cedente@empresa.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("(11) 9 1234-5678"), {
      target: { value: "(11) 9 1234-5678" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nome do cedente"), {
      target: { value: "Cedente Teste" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Cadastrar cedente" }));

    await waitFor(() => {
      expect(api.createAssignor).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/assignors/asgn-new");
    });
  });

  it("shows error message when createAssignor API fails", async () => {
    vi.mocked(api.createAssignor).mockRejectedValue(new Error("Documento já cadastrado."));
    render(<NewAssignorPage />);

    fireEvent.change(screen.getByPlaceholderText("000.000.000-00"), {
      target: { value: "123.456.789-09" },
    });
    fireEvent.change(screen.getByPlaceholderText("cedente@empresa.com"), {
      target: { value: "cedente@empresa.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("(11) 9 1234-5678"), {
      target: { value: "(11) 9 1234-5678" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nome do cedente"), {
      target: { value: "Cedente Teste" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Cadastrar cedente" }));

    expect(await screen.findByText("Documento já cadastrado.")).toBeInTheDocument();
  });
});
