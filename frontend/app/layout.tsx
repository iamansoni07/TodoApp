import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./providers/QueryProvider";
import ErrorBoundary from "./components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Professional Todo App - Task Management Made Simple",
  description: "A powerful, intuitive task management application designed to help you stay organized, focused, and productive in your daily life.",
  keywords: ["todo", "task management", "productivity", "organization", "react", "nextjs"],
  authors: [{ name: "Todo App Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Professional Todo App - Task Management Made Simple",
    description: "A powerful, intuitive task management application designed to help you stay organized, focused, and productive in your daily life.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Todo App - Task Management Made Simple",
    description: "A powerful, intuitive task management application designed to help you stay organized, focused, and productive in your daily life.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased" suppressHydrationWarning={true}>
        <ErrorBoundary>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
