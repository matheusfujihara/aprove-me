"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { TopNav } from "@/components/top-nav";
import { getAssignors, getPayableById, updatePayable } from "@/lib/api";
import type { Assignor } from "@/lib/types";

interface FormErrors {
  value?: string;
  emissionDate?: string;
}

function toDateInput(value: string): string {
  return new Date(value).toISOString().split("T")[0];
}

export default function EditPayablePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const payableId = params.id;

  const [assignors, setAssignors] = useState<Assignor[]>([]);
  const [value, setValue] = useState("");
  const [emissionDate, setEmissionDate] = useState("");
  const [assignorId, setAssignorId] = useState("");
  const [initialValue, setInitialValue] = useState("");
  const [initialEmissionDate, setInitialEmissionDate] = useState("");
  const [initialAssignorId, setInitialAssignorId] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getPayableById(payableId), getAssignors()])
      .then(([payable, assignorList]) => {
        const v = String(payable.value);
        const d = toDateInput(payable.emissionDate);
        setValue(v);
        setEmissionDate(d);
        setAssignorId(payable.assignorId);
        setInitialValue(v);
        setInitialEmissionDate(d);
        setInitialAssignorId(payable.assignorId);
        setAssignors(assignorList);
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Falha ao carregar dados.";
        setRequestError(message);
      })
      .finally(() => setLoading(false));
  }, [payableId]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    const numericValue = Number(value.replace(",", "."));

    if (!value.trim() || Number.isNaN(numericValue) || numericValue <= 0) {
      nextErrors.value = "Informe um valor numérico maior que zero.";
    }

    if (!emissionDate) {
      nextErrors.emissionDate = "Informe a data de emissão.";
    }

    return nextErrors;
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validate();
    setErrors(validation);
    setRequestError("");

    if (Object.keys(validation).length > 0) {
      return;
    }

    setSaving(true);

    try {
      await updatePayable(payableId, {
        value: Number(value.replace(",", ".")),
        emissionDate,
        assignorId,
      });
      router.push(`/payables/${payableId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao atualizar pagável.";
      setRequestError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGuard>
      <TopNav />
      <main className="page-shell">
        <section className="panel">
          <h1>Editar pagável</h1>
          {loading ? <p className="page-hint">Carregando...</p> : null}

          {!loading ? (
            <form className="stack" onSubmit={onSubmit}>
              <label className="field">
                Valor
                <input value={value} onChange={(event) => setValue(event.target.value)} inputMode="decimal" />
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
              </label>

              {requestError ? <p className="form-error">{requestError}</p> : null}

              <button
                type="submit"
                className="primary-btn"
                disabled={saving || (value === initialValue && emissionDate === initialEmissionDate && assignorId === initialAssignorId)}
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </form>
          ) : null}
        </section>
      </main>
    </AuthGuard>
  );
}
