"use client";

import { useState, useEffect, type ReactNode } from "react";
import { ConvexProvider } from "convex/react";
import type { ConvexReactClient } from "convex/react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<ConvexReactClient | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) return;
    import("convex/react").then(({ ConvexReactClient }) => {
      setClient(new ConvexReactClient(url));
    });
  }, []);

  if (!client) {
    return <>{children}</>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
