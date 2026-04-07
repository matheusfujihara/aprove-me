import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PayablesListPage from "@/app/payables/page";
import * as api from "@/lib/api";
import type { Payable } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/payables",
}));

vi.mock("@/components/auth-guard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/top-nav", () => ({
  TopNav: () => <nav data-testid="top-nav" />,
}));

vi.mock("@/lib/api", () => ({
  getPayables: vi.fn(),
  deletePayable: vi.fn(),
}));

const mockPayables: Payable[] = [
  {
    id: "pay-1",
    value: 1500.5,
    emissionDate: "2025-01-15T00:00:00.000Z",
    assignorId: "asgn-1",
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "pay-2",
    value: 200.0,
    emissionDate: "2025-02-20T00:00:00.000Z",
    assignorId: "asgn-2",
    createdAt: "2025-02-20T00:00:00.000Z",
    updatedAt: "2025-02-20T00:00:00.000Z",
    deletedAt: null,
  },
];

describe("PayablesListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    vi.mocked(api.getPayables).mockReturnValue(new Promise(() => {}));
    render(<PayablesListPage />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("shows empty state when there are no payables", async () => {
    vi.mocked(api.getPayables).mockResolvedValue([]);
    render(<PayablesListPage />);
    expect(await screen.findByText("Nenhum pagável cadastrado.")).toBeInTheDocument();
  });

  it("renders payables in a table after loading", async () => {
    vi.mocked(api.getPayables).mockResolvedValue(mockPayables);
    render(<PayablesListPage />);

    expect(await screen.findByText("pay-1")).toBeInTheDocument();
    expect(screen.getByText("R$ 1500.50")).toBeInTheDocument();
    expect(screen.getByText("pay-2")).toBeInTheDocument();
    expect(screen.getByText("R$ 200.00")).toBeInTheDocument();
  });

  it("renders detail and edit links for each payable", async () => {
    vi.mocked(api.getPayables).mockResolvedValue(mockPayables);
    render(<PayablesListPage />);

    await screen.findByText("pay-1");

    const detailLinks = screen.getAllByRole("link", { name: "Detalhes" });
    expect(detailLinks).toHaveLength(2);
    expect(detailLinks[0]).toHaveAttribute("href", "/payables/pay-1");

    const editLinks = screen.getAllByRole("link", { name: "Editar" });
    expect(editLinks[0]).toHaveAttribute("href", "/payables/pay-1/edit");
  });

  it("shows error message when API fails", async () => {
    vi.mocked(api.getPayables).mockRejectedValue(new Error("Falha de rede."));
    render(<PayablesListPage />);
    expect(await screen.findByText("Falha de rede.")).toBeInTheDocument();
  });

  it("removes payable from list after confirming delete", async () => {
    vi.mocked(api.getPayables).mockResolvedValue(mockPayables);
    vi.mocked(api.deletePayable).mockResolvedValue(undefined);
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<PayablesListPage />);
    await screen.findByText("pay-1");

    const deleteButtons = screen.getAllByRole("button", { name: "Excluir" });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(api.deletePayable).toHaveBeenCalledWith("pay-1");
      expect(screen.queryByText("pay-1")).not.toBeInTheDocument();
    });
  });

  it("does not delete payable when confirm is cancelled", async () => {
    vi.mocked(api.getPayables).mockResolvedValue(mockPayables);
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<PayablesListPage />);
    await screen.findByText("pay-1");

    fireEvent.click(screen.getAllByRole("button", { name: "Excluir" })[0]);

    expect(api.deletePayable).not.toHaveBeenCalled();
    expect(screen.getByText("pay-1")).toBeInTheDocument();
  });
});
