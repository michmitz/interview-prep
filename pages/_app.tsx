import React from "react";
import "@/styles/globals.css";
import { SessionProvider, getSession, useSession } from "next-auth/react";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { Layout } from "@/components/molecules/layout/Layout";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
