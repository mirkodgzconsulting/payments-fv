import Link from "next/link";
import Image from "next/image";

export default function CanceledPage() {
  return (
    <div className="container">
      <div className="card">
        <div className="logo">
          <Image
            src="/logo-felizviaje-def-blue.png"
            alt="FelizViaje"
            width={200}
            height={60}
            priority
          />
        </div>
        
        <h1 className="title" style={{ color: "#dc2626" }}>Pagamento annullato ❌</h1>
        <p className="subtitle">
          Nessun addebito — hai annullato il pagamento. Puoi riprovare quando vuoi.
        </p>
        
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/" className="button button-secondary">
            Torna alla pagina principale
          </Link>
        </div>
      </div>
    </div>
  );
}
