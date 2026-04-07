import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PayableDetailsPage from "@/app/payables/[id]/page";
import * as api from "@/lib/api";
import type { Payable } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/payables/pay-1",
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
}));

const mockPayable: Payable = {
  id: "pay-1",
  value: 1500.5,
  emissionDate: "2025-01-15T00:00:00.000Z",
  assignorId: "asgn-1",
  createdAt: "2025-01-15T00:00:00.000Z",
  updatedAt: "2025-01-15T00:00:00.000Z",
  deletedAt: null,
};

describe("PayableDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    vi.mocked(api.getPayableById).mockReturnValue(new Promise(() => {}));
    render(<PayableDetailsPage />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("renders payable details after loading", async () => {
    vi.mocked(api.getPayableById).mockResolvedValue(mockPayable);
    render(<PayableDetailsPage />);

    expect(await screen.findByRole("heading", { name: "Detalhes do pagável" })).toBeInTheDocument();
    expect(screen.getByText("pay-1")).toBeInTheDocument();
    expect(screen.getByText("R$ 1500.50")).toBeInTheDocument();
    expect(screen.getByText("asgn-1")).toBeInTheDocument();
  });

  it("renders edit and back links", async () => {
    vi.mocked(api.getPayableById).mockResolvedValue(mockPayable);
    render(<PayableDetailsPage />);

    await screen.findByRole("heading", { name: "Detalhes do pagável" });

    expect(screen.getByRole("link", { name: "Editar pagável" })).toHaveAttribute(
      "href",
      "/payables/pay-1/edit",
    );
    expect(screen.getByRole("link", { name: "Voltar para listagem" })).toHaveAttribute(
      "href",
      "/payables",
    );
    expect(screen.getByRole("link", { name: "Ver dados do cedente" })).toHaveAttribute(
      "href",
      "/assignors/asgn-1",
    );
  });

  it("shows error message when API fails", async () => {
    vi.mocked(api.getPayableById).mockRejectedValue(new Error("Pagável não encontrado."));
    render(<PayableDetailsPage />);
    expect(await screen.findByText("Pagável não encontrado.")).toBeInTheDocument();
  });

  it("calls getPayableById with the correct id", async () => {
    vi.mocked(api.getPayableById).mockResolvedValue(mockPayable);
    render(<PayableDetailsPage />);
    await screen.findByRole("heading", { name: "Detalhes do pagável" });
    expect(api.getPayableById).toHaveBeenCalledWith("pay-1");
  });
});
