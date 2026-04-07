"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api";
import { clearAccessToken, getAccessToken, isTokenExpired } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token || isTokenExpired(token)) {
      clearAccessToken();
      router.replace(`/login?next=${encodeURIComponent(pathname || "/payables")}`);
      return;
    }

    getCurrentUser()
      .then(() => setReady(true))
      .catch(() => {
        clearAccessToken();
        router.replace("/login");
      });
  }, [pathname, router]);

  if (!ready) {
    return <p className="page-hint">Validando sessão...</p>;
  }

  return <>{children}</>;
}
