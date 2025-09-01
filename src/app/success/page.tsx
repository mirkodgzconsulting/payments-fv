import Link from "next/link";
import Image from "next/image";

export default function SuccessPage() {
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
        
        <h1 className="title" style={{ color: "#059669" }}>Pagamento riuscito ✅</h1>
        <p className="subtitle">
          Grazie! Abbiamo ricevuto il tuo pagamento. Riceverai una conferma via email da Stripe.
        </p>
        
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/" className="button button-primary">
            Torna alla pagina principale
          </Link>
        </div>
      </div>
    </div>
  );
}
