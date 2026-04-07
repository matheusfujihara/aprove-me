import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AssignorDetailsPage from "@/app/assignors/[id]/page";
import * as api from "@/lib/api";
import type { Assignor } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/assignors/asgn-1",
  useParams: () => ({ id: "asgn-1" }),
}));

vi.mock("@/components/auth-guard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/top-nav", () => ({
  TopNav: () => <nav data-testid="top-nav" />,
}));

vi.mock("@/lib/api", () => ({
  getAssignorById: vi.fn(),
}));

const mockAssignor: Assignor = {
  id: "asgn-1",
  name: "Empresa A",
  document: "12.345.678/0001-99",
  email: "a@empresa.com",
  phone: "(11) 9 9999-9999",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
  deletedAt: null,
};

describe("AssignorDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    vi.mocked(api.getAssignorById).mockReturnValue(new Promise(() => {}));
    render(<AssignorDetailsPage />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("renders assignor details after loading", async () => {
    vi.mocked(api.getAssignorById).mockResolvedValue(mockAssignor);
    render(<AssignorDetailsPage />);

    expect(await screen.findByRole("heading", { name: "Detalhes do cedente" })).toBeInTheDocument();
    expect(screen.getByText("asgn-1")).toBeInTheDocument();
    expect(screen.getByText("Empresa A")).toBeInTheDocument();
    expect(screen.getByText("12.345.678/0001-99")).toBeInTheDocument();
    expect(screen.getByText("a@empresa.com")).toBeInTheDocument();
    expect(screen.getByText("(11) 9 9999-9999")).toBeInTheDocument();
  });

  it("renders back to payables link", async () => {
    vi.mocked(api.getAssignorById).mockResolvedValue(mockAssignor);
    render(<AssignorDetailsPage />);

    await screen.findByRole("heading", { name: "Detalhes do cedente" });

    expect(screen.getByRole("link", { name: "Voltar para pagáveis" })).toHaveAttribute(
      "href",
      "/payables",
    );
  });

  it("shows error message when API fails", async () => {
    vi.mocked(api.getAssignorById).mockRejectedValue(new Error("Cedente não encontrado."));
    render(<AssignorDetailsPage />);
    expect(await screen.findByText("Cedente não encontrado.")).toBeInTheDocument();
  });

  it("calls getAssignorById with the correct id", async () => {
    vi.mocked(api.getAssignorById).mockResolvedValue(mockAssignor);
    render(<AssignorDetailsPage />);
    await screen.findByRole("heading", { name: "Detalhes do cedente" });
    expect(api.getAssignorById).toHaveBeenCalledWith("asgn-1");
  });
});
