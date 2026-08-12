import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { interFont, jadWordmarkFont } from "@/lib/fonts";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Nav } from "@/components/nav/Nav";
import "./globals.css";

const BASE_URL = "https://jad.com.br";
const TITLE = "JAD | Engenharia Digital Inteligente";
const DESCRIPTION =
  "Criamos softwares, plataformas digitais e soluções com inteligência artificial para transformar processos complexos em experiências simples, eficientes e escaláveis.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: BASE_URL,
    siteName: "JAD",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JAD",
  alternateName: "Just A Dream",
  url: BASE_URL,
  description: DESCRIPTION,
  slogan: "Engenharia digital inteligente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${interFont.variable} ${jadWordmarkFont.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <SmoothScrollProvider>
          <Nav />
          {children}
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  );
}
