import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sign in | TigerOne Business System",
  description: "Secure access to TigerOne billing, inventory and reporting.",
  icons: {
    icon: "/tigerone-mark.png",
    shortcut: "/tigerone-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
