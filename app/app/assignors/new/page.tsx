"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { TopNav } from "@/components/top-nav";
import { createAssignor } from "@/lib/api";
import { isValidCpfOrCnpj, isValidEmail, maskDocument, maskPhone, onlyDigits, validateDocumentInline, validatePhoneInline } from "@/lib/validators";

interface AssignorFormErrors {
  document?: string;
  email?: string;
  phone?: string;
  name?: string;
}

export default function NewAssignorPage() {
  const router = useRouter();
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<AssignorFormErrors>({});
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (): AssignorFormErrors => {
    const nextErrors: AssignorFormErrors = {};

    if (!document.trim() || !isValidCpfOrCnpj(document)) {
      nextErrors.document = "Informe CPF/CNPJ válido.";
    }

    if (!email.trim() || !isValidEmail(email)) {
      nextErrors.email = "Informe e-mail válido.";
    }

    if (!phone.trim() || onlyDigits(phone).length < 10) {
      nextErrors.phone = "Informe telefone válido com DDD.";
    }

    if (!name.trim() || name.trim().length > 140) {
      nextErrors.name = "Informe nome com até 140 caracteres.";
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

    setLoading(true);

    try {
      const assignor = await createAssignor({
        document: document.trim(),
        email: email.trim(),
        phone: phone.trim(),
        name: name.trim(),
      });

      router.push(`/assignors/${assignor.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível cadastrar cedente.";
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
          <h1>Novo cedente</h1>
          <p className="page-hint">Cadastro com validações de CPF/CNPJ, e-mail e campos obrigatórios.</p>

          <form className="stack" onSubmit={onSubmit}>
            <label className="field">
              CPF ou CNPJ
              <input
                value={document}
                onChange={(event) => {
                  const masked = maskDocument(event.target.value);
                  console.log(111,masked)
                  setDocument(masked);
                  setErrors((prev) => ({ ...prev, document: validateDocumentInline(masked) || undefined }));
                }}
                placeholder="000.000.000-00"
                maxLength={18}
                inputMode="numeric"
              />
              {errors.document ? <span className="form-error">{errors.document}</span> : null}
            </label>

            <label className="field">
              E-mail
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    email: isValidEmail(event.target.value) ? undefined : "Informe e-mail válido.",
                  }));
                }}
                placeholder="cedente@empresa.com"
              />
              {errors.email ? <span className="form-error">{errors.email}</span> : null}
            </label>

            <label className="field">
              Telefone
              <input
                value={phone}
                onChange={(event) => {
                  const masked = maskPhone(event.target.value);
                  setPhone(masked);
                  setErrors((prev) => ({ ...prev, phone: validatePhoneInline(masked) || undefined }));
                }}
                placeholder="(11) 9 1234-5678"
                maxLength={16}
                inputMode="numeric"
              />
              {errors.phone ? <span className="form-error">{errors.phone}</span> : null}
            </label>

            <label className="field">
              Nome
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nome do cedente"
              />
              {errors.name ? <span className="form-error">{errors.name}</span> : null}
            </label>

            {requestError ? <p className="form-error">{requestError}</p> : null}

            <button
              type="submit"
              className="primary-btn"
              disabled={loading || !document.trim() || !email.trim() || !phone.trim() || !name.trim()}
            >
              {loading ? "Salvando..." : "Cadastrar cedente"}
            </button>
          </form>
        </section>
      </main>
    </AuthGuard>
  );
}
