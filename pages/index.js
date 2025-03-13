import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Bienvenue sur Gold Nord</h1>
      <Link href="/transactions">Accéder au suivi des transactions</Link>
    </div>
  );
}
