"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { TopNav } from "@/components/top-nav";
import { deletePayable, getPayables } from "@/lib/api";
import type { Payable } from "@/lib/types";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("pt-BR");
}

export default function PayablesListPage() {
  const [items, setItems] = useState<Payable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadItems = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getPayables();
      setItems(result);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Falha ao carregar pagáveis.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const onDelete = async (id: string) => {
    const accepted = window.confirm("Deseja excluir este pagável?");
    if (!accepted) {
      return;
    }

    try {
      await deletePayable(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Falha ao excluir pagável.";
      setError(message);
    }
  };

  return (
    <AuthGuard>
      <TopNav />
      <main className="page-shell">
        <section className="panel">
          <div className="section-head">
            <div>
              <h1>Pagáveis</h1>
              <p className="page-hint">Listagem conectada na API, exibindo id, valor e data de emissão.</p>
            </div>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          {loading ? (
            <p className="page-hint">Carregando...</p>
          ) : items.length === 0 ? (
            <p className="page-hint">Nenhum pagável cadastrado.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Valor</th>
                    <th>Data de emissão</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>R$ {item.value.toFixed(2)}</td>
                      <td>{formatDate(item.emissionDate)}</td>
                      <td className="table-actions">
                        <Link href={`/payables/${item.id}`}>Detalhes</Link>
                        <Link href={`/payables/${item.id}/edit`}>Editar</Link>
                        <button type="button" onClick={() => onDelete(item.id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}
