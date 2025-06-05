import React from "react";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {

  return (
    <div
      style={{ width: '100vw', height: '100vh'}}
      className={`centerContent fadeIn`}
    >
      <Image
        src="/background-1.jpg"
        width={0}
        height={0}
        // fill
        priority={true}
        quality={100}
        style={{
          width: '100vw',
          height: '100vh',
        objectFit: "cover",
        overflow: "auto",
        backgroundPosition: "center center", position: 'absolute', zIndex: -100, }}
        alt="background"
      />
      {children}
    </div>
  );
};
