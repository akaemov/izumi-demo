import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
const tenor = localFont({
  src: "../../public/fonts/TenorSans-Regular.ttf",
  variable: "--font-tenor",
  display: "swap",
});
const golos = localFont({
  src: "../../public/fonts/GolosText.ttf",
  variable: "--font-golos",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Изуми — коллекционный дом",
  description:
    "Изуми. Источник вдохновения. Коллекционный дом и философия пространства для жизни.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Изуми — коллекционный дом",
    description: "Источник вдохновения. Пространство вашей жизни.",
    locale: "ru_RU",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${tenor.variable} ${golos.variable}`}>
      <body>{children}</body>
    </html>
  );
}
