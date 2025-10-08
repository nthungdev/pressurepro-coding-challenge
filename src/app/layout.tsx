import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getFavoriteConferences, getJoinedConferences } from "@/lib/query";
import { verifySession } from "@/lib/session";
import AuthProvider from "@/providers/auth-provider";
import ConferenceProvider from "@/providers/conference-provider";
import ReactQueryProvider from "@/providers/react-query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Conference Explorer",
  description: "Explore the latest trends in technology at our conference.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await verifySession();

  const joinedIds = session.isAuth
    ? (await getJoinedConferences(session.userId)).map((c) => c.id)
    : [];
  const favoriteConferences = session.isAuth
    ? (await getFavoriteConferences(session.userId)).map((c) => c.id)
    : [];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <AuthProvider value={session}>
            <ConferenceProvider
              favoriteIds={favoriteConferences}
              joinedIds={joinedIds}
            >
              {children}
            </ConferenceProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
