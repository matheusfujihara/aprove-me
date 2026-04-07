"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { TopNav } from "@/components/top-nav";
import { getPayableById } from "@/lib/api";
import type { Payable } from "@/lib/types";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("pt-BR");
}

export default function PayableDetailsPage() {
  const params = useParams<{ id: string }>();
  const payableId = params.id;

  const [payable, setPayable] = useState<Payable | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPayableById(payableId)
      .then((result) => setPayable(result))
      .catch((requestError) => {
        const message = requestError instanceof Error ? requestError.message : "Falha ao buscar pagável.";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [payableId]);

  return (
    <AuthGuard>
      <TopNav />
      <main className="page-shell">
        <section className="panel">
          {loading ? <p className="page-hint">Carregando...</p> : null}
          {error ? <p className="form-error">{error}</p> : null}

          {payable ? (
            <div className="stack">
              <h1>Detalhes do pagável</h1>
              <p>
                <strong>ID:</strong> {payable.id}
              </p>
              <p>
                <strong>Valor:</strong> R$ {payable.value.toFixed(2)}
              </p>
              <p>
                <strong>Data de emissão:</strong> {formatDate(payable.emissionDate)}
              </p>
              <p>
                <strong>Cedente:</strong> {payable.assignorId}
              </p>

              <div className="row">
                <Link href={`/assignors/${payable.assignorId}`}>Ver dados do cedente</Link>
                <Link href={`/payables/${payable.id}/edit`}>Editar pagável</Link>
                <Link href="/payables">Voltar para listagem</Link>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </AuthGuard>
  );
}
