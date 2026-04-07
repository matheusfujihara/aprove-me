import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditPayablePage from "@/app/payables/[id]/edit/page";
import * as api from "@/lib/api";
import type { Assignor, Payable } from "@/lib/types";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/payables/pay-1/edit",
  useParams: () => ({ id: "pay-1" }),
}));

vi.mock("@/components/auth-guard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/top-nav", () => ({
  TopNav: () => <nav data-testid="top-nav" />,
}));

vi.mock("@/lib/api", () => ({
  getPayableById: vi.fn(),
  getAssignors: vi.fn(),
  updatePayable: vi.fn(),
}));

const mockPayable: Payable = {
  id: "pay-1",
  value: 1500,
  emissionDate: "2025-01-15T00:00:00.000Z",
  assignorId: "asgn-1",
  createdAt: "2025-01-15T00:00:00.000Z",
  updatedAt: "2025-01-15T00:00:00.000Z",
  deletedAt: null,
};

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

describe("EditPayablePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    vi.mocked(api.getPayableById).mockReturnValue(new Promise(() => {}));
    vi.mocked(api.getAssignors).mockReturnValue(new Promise(() => {}));
    render(<EditPayablePage />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("pre-fills form with fetched payable data", async () => {
    vi.mocked(api.getPayableById).mockResolvedValue(mockPayable);
    vi.mocked(api.getAssignors).mockResolvedValue(mockAssignors);
    render(<EditPayablePage />);

    const valueInput = await screen.findByDisplayValue("1500");
    expect(valueInput).toBeInTheDocument();

    const dateInput = screen.getByDisplayValue("2025-01-15");
    expect(dateInput).toBeInTheDocument();
  });

  it("shows validation error when value is cleared", async () => {
    vi.mocked(api.getPayableById).mockResolvedValue(mockPayable);
    vi.mocked(api.getAssignors).mockResolvedValue(mockAssignors);
    render(<EditPayablePage />);

    await screen.findByDisplayValue("1500");

    fireEvent.change(screen.getByDisplayValue("1500"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar alterações" }));

    expect(await screen.findByText("Informe um valor numérico maior que zero.")).toBeInTheDocument();
    expect(api.updatePayable).not.toHaveBeenCalled();
  });

  it("calls updatePayable and redirects on valid submit", async () => {
    vi.mocked(api.getPayableById).mockResolvedValue(mockPayable);
    vi.mocked(api.getAssignors).mockResolvedValue(mockAssignors);
    vi.mocked(api.updatePayable).mockResolvedValue({ ...mockPayable, value: 2000 });
    render(<EditPayablePage />);

    await screen.findByDisplayValue("1500");

    fireEvent.change(screen.getByDisplayValue("1500"), { target: { value: "2000" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar alterações" }));

    await waitFor(() => {
      expect(api.updatePayable).toHaveBeenCalledWith("pay-1", expect.objectContaining({ value: 2000 }));
      expect(mockPush).toHaveBeenCalledWith("/payables/pay-1");
    });
  });

  it("shows error message when updatePayable API fails", async () => {
    vi.mocked(api.getPayableById).mockResolvedValue(mockPayable);
    vi.mocked(api.getAssignors).mockResolvedValue(mockAssignors);
    vi.mocked(api.updatePayable).mockRejectedValue(new Error("Falha ao atualizar."));
    render(<EditPayablePage />);

    await screen.findByDisplayValue("1500");

    fireEvent.change(screen.getByDisplayValue("1500"), { target: { value: "999" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar alterações" }));

    expect(await screen.findByText("Falha ao atualizar.")).toBeInTheDocument();
  });

  it("shows error when data loading fails", async () => {
    vi.mocked(api.getPayableById).mockRejectedValue(new Error("Falha ao carregar dados."));
    vi.mocked(api.getAssignors).mockResolvedValue([]);
    render(<EditPayablePage />);
    expect(await screen.findByText("Falha ao carregar dados.")).toBeInTheDocument();
  });
});
