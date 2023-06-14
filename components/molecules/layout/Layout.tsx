import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { data: session } = useSession();
  const [randomBackground, setRandomBackground] =
    React.useState<string>("background-1.jpg");

  const backgrounds = [...Array(7).keys()].map((i) => {
    return `background-${i + 1}.jpg`;
  });

  React.useEffect(() => {
    if (randomBackground === "background-1.jpg" && session) {
      const randomizeBackground = () => {
        const randomBgIndex = Math.floor(Math.random() * 7);
        return backgrounds[randomBgIndex];
      };
      const background = randomizeBackground();
      setRandomBackground(background);
    }

    if (randomBackground !== "background-1.jpg") {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomBackground, session]);

  return (
    <div
      // style={{
      //   backgroundImage: `url('/${randomBackground}')`,
      //   height: "100vh",
      //   width: "100vw",
      //   backgroundSize: "cover",
      //   overflow: "auto",
      //   backgroundPosition: "center center",
      // }}
      style={{ width: '100vw', height: '100vh'}}
      className={`centerContent ${session && "fadeIn"}`}
    >
      <Image
        src={`/background-2.jpg`}
        width={0}
        height={0}
        fill
        sizes="100%"
        priority={true}
        quality={100}
        // placeholder="blur"
        // blurDataURL="/background-1.jpg"
        style={{
        objectFit: "cover",
        overflow: "auto",
        backgroundPosition: "center center", position: 'absolute', zIndex: -10, }} // optional
        alt="background"
      />
      {children}
    </div>
  );
};
