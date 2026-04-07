"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAccessToken } from "@/lib/auth";

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/payables", label: "Pagáveis" },
    { href: "/payables/new", label: "Novo pagável" },
    { href: "/assignors/new", label: "Novo cedente" },
  ];

  const logout = () => {
    clearAccessToken();
    router.push("/login");
  };

  return (
    <header className="shell-nav">
      <div className="shell-nav-inner">
        <Link className="brand" href="/payables">
          Aproveme Front
        </Link>

        <nav className="main-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "is-active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button type="button" className="ghost-btn" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
}
