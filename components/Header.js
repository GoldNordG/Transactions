import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav>
        <Link href="/">
          <a>Accueil</a>
        </Link>
        <Link href="/transactions">
          <a>Suivi des Transactions</a>
        </Link>
      </nav>
    </header>
  );
}
