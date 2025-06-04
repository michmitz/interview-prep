import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "@/components/molecules/layout/Layout";
import Head from "next/head";

export default function App({
  Component,
  pageProps,
}: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <title>AI Interview Prep App</title>
        <meta
          name="description"
          content="Brush up on your interview skills using chatGPT!"
        />
        <meta property="og:image" content="og-preview.png" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
