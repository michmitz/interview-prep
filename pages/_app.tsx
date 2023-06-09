import React from "react";
import "@/styles/globals.css";
import { SessionProvider, getSession, useSession } from "next-auth/react";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { Layout } from "@/components/molecules/layout/Layout";
import Head from "next/head";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <title>AI Interview Question App</title>
        <meta
          name="description"
          content="Brush up on your interview skills using chatGPT!"
        />
      </Head>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
}
