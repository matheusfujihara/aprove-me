import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NewPayablePage from "@/app/payables/new/page";
import * as api from "@/lib/api";
import type { Assignor, CreatePayableResponse } from "@/lib/types";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/payables/new",
}));

vi.mock("@/components/auth-guard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/top-nav", () => ({
  TopNav: () => <nav data-testid="top-nav" />,
}));

vi.mock("@/lib/api", () => ({
  getAssignors: vi.fn(),
  createPayable: vi.fn(),
}));

const mockAssignors: Assignor[] = [
  {
    id: "asgn-1",
    name: "Empresa A",
    document: "12.345.678/0001-99",
    email: "a@empresa.com",
    phone: "(11) 9 9999-9999",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    deletedAt: null,
  },
];

const mockCreateResponse: CreatePayableResponse = {
  payable: {
    id: "pay-new",
    value: 1000,
    emissionDate: "2025-03-01T00:00:00.000Z",
    assignorId: "asgn-1",
    createdAt: "2025-03-01T00:00:00.000Z",
    updatedAt: "2025-03-01T00:00:00.000Z",
    deletedAt: null,
  },
  assignor: mockAssignors[0],
};

describe("NewPayablePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form with value, emission date and assignor fields", async () => {
    vi.mocked(api.getAssignors).mockResolvedValue(mockAssignors);
    render(<NewPayablePage />);

    expect(screen.getByRole("heading", { name: "Novo pagável" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("1500.75")).toBeInTheDocument();
    expect(await screen.findByRole("combobox")).toBeInTheDocument();
  });

  it("shows warning when there are no assignors", async () => {
    vi.mocked(api.getAssignors).mockResolvedValue([]);
    render(<NewPayablePage />);

    expect(
      await screen.findByText(/Nenhum cedente cadastrado/),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    vi.mocked(api.getAssignors).mockResolvedValue(mockAssignors);
    render(<NewPayablePage />);

    await screen.findByRole("combobox");

    // Button is disabled when fields are empty; submit the form directly
    const form = screen.getByRole("button", { name: "Cadastrar pagável" }).closest("form")!;
    fireEvent.submit(form);

    expect(await screen.findByText("Informe um valor numérico maior que zero.")).toBeInTheDocument();
    expect(screen.getByText("Informe a data de emissão.")).toBeInTheDocument();
    expect(screen.getByText("Selecione um cedente.")).toBeInTheDocument();
  });

  it("creates payable and redirects on valid submit", async () => {
    vi.mocked(api.getAssignors).mockResolvedValue(mockAssignors);
    vi.mocked(api.createPayable).mockResolvedValue(mockCreateResponse);
    render(<NewPayablePage />);

    await screen.findByRole("combobox");

    fireEvent.change(screen.getByPlaceholderText("1500.75"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "asgn-1" },
    });
    // Change date after the other inputs so we can target the date input specifically
    const form = screen.getByRole("button", { name: "Cadastrar pagável" }).closest("form")!;
    const dateInput = form.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2025-03-01" } });

    fireEvent.click(screen.getByRole("button", { name: "Cadastrar pagável" }));

    await waitFor(() => {
      expect(api.createPayable).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/payables/pay-new");
    });
  });

  it("shows error when createPayable API fails", async () => {
    vi.mocked(api.getAssignors).mockResolvedValue(mockAssignors);
    vi.mocked(api.createPayable).mockRejectedValue(new Error("Erro ao criar pagável."));
    render(<NewPayablePage />);

    await screen.findByRole("combobox");

    fireEvent.change(screen.getByPlaceholderText("1500.75"), { target: { value: "500" } });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "asgn-1" } });
    const form = screen.getByRole("button", { name: "Cadastrar pagável" }).closest("form")!;
    const dateInput = form.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2025-04-01" } });

    fireEvent.click(screen.getByRole("button", { name: "Cadastrar pagável" }));

    expect(await screen.findByText("Erro ao criar pagável.")).toBeInTheDocument();
  });
});
