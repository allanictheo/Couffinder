import type { Metadata, Viewport } from "next";
import { Anton, Bricolage_Grotesque, Comic_Neue, Silkscreen } from "next/font/google";
import "./globals.css";

/** Impact-like pour les textes « meme ». */
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

/** Grotesque moderne et un peu bricolée pour tout le reste. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

/** Comic Sans libre, pour le doge-speak (chargé seulement quand il sert). */
const comicNeue = Comic_Neue({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-comic-neue",
  display: "swap",
  preload: false,
});

/** Police pixel pour le HUD (+100, DEAL WITH IT). */
const silkscreen = Silkscreen({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-silkscreen",
  display: "swap",
  preload: false,
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const title = "Chouffinder : c'est chouffin ou pas ?";
const description =
  "Tape un mot, le Chouffinder te dit s'il est chouffin ou pas chouffin. Kaamelott, hydromel, Sabaton : la science exacte de la chouffinitude, validée par la communauté.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Chouffinder" },
  description,
  applicationName: "Chouffinder",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "Chouffinder",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0a16",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${anton.variable} ${bricolage.variable} ${comicNeue.variable} ${silkscreen.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="backdrop" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
