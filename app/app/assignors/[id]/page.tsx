"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { TopNav } from "@/components/top-nav";
import { getAssignorById } from "@/lib/api";
import type { Assignor } from "@/lib/types";

export default function AssignorDetailsPage() {
  const params = useParams<{ id: string }>();
  const assignorId = params.id;

  const [assignor, setAssignor] = useState<Assignor | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAssignorById(assignorId)
      .then((result) => setAssignor(result))
      .catch((requestError) => {
        const message = requestError instanceof Error ? requestError.message : "Falha ao buscar cedente.";
        setError(message);
      });
  }, [assignorId]);

  return (
    <AuthGuard>
      <TopNav />
      <main className="page-shell">
        <section className="panel">
          <h1>Detalhes do cedente</h1>

          {error ? <p className="form-error">{error}</p> : null}

          {assignor ? (
            <div className="stack">
              <p>
                <strong>ID:</strong> {assignor.id}
              </p>
              <p>
                <strong>Nome:</strong> {assignor.name}
              </p>
              <p>
                <strong>Documento:</strong> {assignor.document}
              </p>
              <p>
                <strong>E-mail:</strong> {assignor.email}
              </p>
              <p>
                <strong>Telefone:</strong> {assignor.phone}
              </p>

              <div className="row">
                <Link href="/payables">Voltar para pagáveis</Link>
              </div>
            </div>
          ) : (
            !error && <p className="page-hint">Carregando...</p>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}
