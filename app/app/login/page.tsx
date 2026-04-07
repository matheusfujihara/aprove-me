"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { login } from "@/lib/api";
import { setAccessToken } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/payables";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login({ email: email.trim(), password });
      setAccessToken(result.accessToken);
      router.replace(nextPath);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Não foi possível entrar.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel auth-panel">
      <h1>Entrar</h1>
      <p className="page-hint">Use seu usuário para acessar as rotas protegidas.</p>

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
            placeholder="********"
            autoComplete="current-password"
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="page-hint">
        Não possui conta? <Link href="/register">Criar usuário</Link>
      </p>
    </section>
  );
}

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <Suspense fallback={<section className="panel auth-panel"><p className="page-hint">Carregando...</p></section>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
