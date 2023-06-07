import React from "react";
import { NextPage } from "next";
import styles from "../styles/Home.module.css";
import prisma from "@/lib/prisma";
import { Sidebar } from "@/components/atoms/sidebar/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SignedOut } from "@/components/molecules/signed_out/SignedOut";

const TellMeAboutYourself: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const pageLoading = status === "loading";

  const refreshData = () => {
    router.replace(router.asPath);
  };

  // const handleSubmitAnswer = async (id: string) => {
  //   const data = {
  //     note: updatedNote?.updatedNote,
  //   };

  //   const response = await fetch(`/api/note/${id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });

  //   if (response.status === 200) {
  //     refreshData();
  //   } else {
  //     setResponse("Note update failed");
  //   }
  // };

  // const handleDeleteNote = async (id: string) => {
  //   const response = await fetch(`/api/note/${id}`, {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   if (response.status === 200) {
  //     refreshData();
  //   } else {
  //     setResponse("Delete failed");
  //   }
  // };

  if (session) {
    return (
      <main className="lightGlassEffect">
        <div className="container">
          <div className="sidebar">
            <Sidebar
              headerText="Tell Me About Yourself."
              isLoggedIn={true}
              user={session?.user?.email}
            />
          </div>

          <div className="rightContainer">
            <p className={`${styles.header} greenGradient`}>
              Tell me about yourself.
            </p>
            <p>
              Enter your answer below. If you would like the AI to touch it up,
              click the Touch Up button.
            </p>
            {/* Add link for notes page */}
            <p>
              Your saved response can be viewed and edited in the Notes page.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!session && pageLoading) {
    return <></>;
  }

  return <SignedOut />;
};

export default TellMeAboutYourself;
