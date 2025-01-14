"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export function PayPalProvider({ children }: { children: React.ReactNode }) {
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "USD",
    intent: "capture",
    locale: "es_CO",
    components: ["buttons"],
    dataNamespace: "PayPalSDK",
    disableFunding: ["card"],
    enableFunding: ["paypal"],
  };


  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}