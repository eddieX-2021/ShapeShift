
import ClientLayout from "./ClientLayout";
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "ShapeShift",
  description: "AI-powered fitness assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
