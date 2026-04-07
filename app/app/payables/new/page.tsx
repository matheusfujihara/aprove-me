"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { TopNav } from "@/components/top-nav";
import { createPayable, getAssignors } from "@/lib/api";
import type { Assignor } from "@/lib/types";

interface PayableFormErrors {
  value?: string;
  emissionDate?: string;
  assignorId?: string;
}

export default function NewPayablePage() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [emissionDate, setEmissionDate] = useState("");
  const [assignorId, setAssignorId] = useState("");
  const [assignors, setAssignors] = useState<Assignor[]>([]);
  const [assignorsLoaded, setAssignorsLoaded] = useState(false);
  const [errors, setErrors] = useState<PayableFormErrors>({});
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAssignors()
      .then((result) => {
        setAssignors(result);
        setAssignorsLoaded(true);
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Não foi possível carregar cedentes.";
        setRequestError(message);
        setAssignorsLoaded(true);
      });
  }, []);

  const selectedAssignor = useMemo(
    () => assignors.find((assignor) => assignor.id === assignorId),
    [assignorId, assignors],
  );

  const validate = (): PayableFormErrors => {
    const nextErrors: PayableFormErrors = {};

    const numericValue = Number(value.replace(",", "."));
    if (!value.trim() || Number.isNaN(numericValue) || numericValue <= 0) {
      nextErrors.value = "Informe um valor numérico maior que zero.";
    }

    if (!emissionDate) {
      nextErrors.emissionDate = "Informe a data de emissão.";
    }

    if (!assignorId) {
      nextErrors.assignorId = "Selecione um cedente.";
    }

    return nextErrors;
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validate();
    setErrors(validation);
    setRequestError("");

    if (Object.keys(validation).length > 0 || !selectedAssignor) {
      return;
    }

    setLoading(true);

    try {
      const result = await createPayable({
        payable: {
          value: Number(value.replace(",", ".")),
          emissionDate,
        },
        assignor: {
          document: selectedAssignor.document,
          email: selectedAssignor.email,
          phone: selectedAssignor.phone,
          name: selectedAssignor.name,
        },
      });

      router.push(`/payables/${result.payable.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível cadastrar pagável.";
      setRequestError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <TopNav />
      <main className="page-shell">
        <section className="panel">
          <h1>Novo pagável</h1>
          <p className="page-hint">Cadastro com validação de campos obrigatórios.</p>

          {assignorsLoaded && assignors.length === 0 && (
            <p className="form-error" style={{ marginBottom: "1rem" }}>
              Nenhum cedente cadastrado. <a href="/assignors/new">Cadastre um cedente</a> antes de criar um pagável.
            </p>
          )}

          <form className="stack" onSubmit={onSubmit}>
            <label className="field">
              Valor
              <input
                value={value}
                onChange={(event) => {
                  const sanitized = event.target.value.replace(",", ".").replace(/[^0-9.]/g, "");
                  const parts = sanitized.split(".");
                  const limited = parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, 2)}` : sanitized;
                  setValue(limited);
                }}
                placeholder="1500.75"
                inputMode="decimal"
              />
              {errors.value ? <span className="form-error">{errors.value}</span> : null}
            </label>

            <label className="field">
              Data de emissão
              <input
                type="date"
                value={emissionDate}
                onChange={(event) => setEmissionDate(event.target.value)}
              />
              {errors.emissionDate ? <span className="form-error">{errors.emissionDate}</span> : null}
            </label>

            <label className="field">
              Cedente
              <select value={assignorId} onChange={(event) => setAssignorId(event.target.value)}>
                <option value="">Selecione um cedente</option>
                {assignors.map((assignor) => (
                  <option key={assignor.id} value={assignor.id}>
                    {assignor.name} ({assignor.document})
                  </option>
                ))}
              </select>
              {errors.assignorId ? <span className="form-error">{errors.assignorId}</span> : null}
            </label>

            {requestError ? <p className="form-error">{requestError}</p> : null}

            <button
              type="submit"
              className="primary-btn"
              disabled={loading || !value.trim() || !emissionDate || !assignorId}
            >
              {loading ? "Salvando..." : "Cadastrar pagável"}
            </button>
          </form>
        </section>
      </main>
    </AuthGuard>
  );
}
