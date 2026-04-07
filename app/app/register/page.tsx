"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Preencha e-mail e senha.");
      return;
    }

    if (password.trim().length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await registerUser({ email: email.trim(), password });
      setSuccess("Usuário criado com sucesso. Faça login para continuar.");
      setTimeout(() => router.push("/login"), 900);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Não foi possível criar usuário.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="panel auth-panel">
        <h1>Criar usuário</h1>
        <p className="page-hint">Cadastro rápido para autenticação do frontend.</p>

        <form onSubmit={onSubmit} className="stack">
          <label className="field">
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@empresa.com"
              autoComplete="email"
            />
          </label>

          <label className="field">
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimo 6 caracteres"
              autoComplete="new-password"
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}
          {success ? <p className="form-success">{success}</p> : null}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Criando..." : "Criar usuário"}
          </button>
        </form>

        <p className="page-hint">
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
