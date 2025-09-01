"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState<null | "now" | "installments" | "subscribe">(null);

  const valid = useMemo(() => {
    const n = parseFloat(amount);
    return description.trim().length > 0 && Number.isFinite(n) && n > 0;
  }, [description, amount]);

  async function startCheckout(mode: "now" | "installments" | "subscribe") {
    if (!valid) return;
    try {
      setSubmitting(mode);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, amount, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Errore creazione sessione");
      if (data?.url) {
        window.location.href = data.url as string;
      }
    } catch (e) {
      alert("Errore nell'avvio del pagamento. Riprova.");
      console.error(e);
    } finally {
      setSubmitting(null);
    }
  }

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
        
        <h1 className="title">Pagamenti FelizViaje</h1>
        <p className="subtitle">
          Inserisci i dettagli del pagamento e scegli un&apos;opzione
        </p>

        <div className="form-group">
          <label htmlFor="description" className="label">
            Descrizione pagamento
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Es. Acconto viaggio Roma"
            className="input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount" className="label">
            Importo (EUR)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Es. 299.00"
            className="input"
          />
        </div>

        <div className="button-group">
          <button
            onClick={() => startCheckout("now")}
            disabled={!valid || submitting !== null}
            className={`button button-primary ${submitting === "now" ? "loading" : ""}`}
          >
            {submitting === "now" ? "Reindirizzamento..." : "Ora"}
          </button>
          
          <button
            onClick={() => startCheckout("installments")}
            disabled={!valid || submitting !== null}
            className={`button button-secondary ${submitting === "installments" ? "loading" : ""}`}
          >
            {submitting === "installments" ? "Reindirizzamento..." : "A rate"}
          </button>
          
          <button
            onClick={() => startCheckout("subscribe")}
            disabled={!valid || submitting !== null}
            className={`button button-success ${submitting === "subscribe" ? "loading" : ""}`}
          >
            {submitting === "subscribe" ? "Reindirizzamento..." : "Abbonati"}
          </button>
        </div>
      </div>
    </div>
  );
}
