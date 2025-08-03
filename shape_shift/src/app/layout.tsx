
import ClientLayout from "./ClientLayout";
import "./globals.css";

export const metadata = {
  title: "Shape Shift",
  description: "A weight loss app",
};

export default async function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}