import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import React from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const [randomBackground, setRandomBackground] = React.useState<string>("");

  const backgrounds = [...Array(9).keys()].map(i => { return `background-${i + 1}.jpg`})


  const randomizeBackground = () => {
    const randomBgIndex = Math.floor(Math.random() * backgrounds.length);
    return backgrounds[randomBgIndex - 1];
  };

  const background = randomizeBackground();

  React.useEffect(() => {
    if (randomBackground) {
      return;
    }

    setRandomBackground(background);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomBackground]);

  return (
    <SessionProvider session={session}>
      <div
        style={{
          backgroundImage: `url('/backgrounds/${randomBackground}')`,
          height: "100vh",
          width: "100vw",
          backgroundSize: "cover",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "650px",
        }}
      >
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
