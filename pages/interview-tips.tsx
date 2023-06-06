import React from "react";
import { GetServerSideProps, NextPage } from "next";
import { Sidebar } from "@/components/atoms/sidebar/Sidebar";
import { useSession } from "next-auth/react";
import { SignedOut } from "@/components/molecules/signed_out/SignedOut";

export const getServerSideProps: GetServerSideProps<{
  data: string;
}> = async () => {
  const res = await fetch("/api/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: [{ "role": 'system', "content": 'Give me an array of 20 job interview tips.'}], maxTokens: 400 }),
  });

  const data = await res.json();
  return { props: { data } };
};

const InterviewTips: NextPage = () => {
  const { data: session, status } = useSession();
  const pageLoading = status === "loading";

  if (session) {
    return (
      <main className="lightGlassEffect">
        <div className="container">
          <div className="sidebar">
            <Sidebar
              headerText="Job Tips"
              isLoggedIn={true}
              user={session?.user?.email}
            />
          </div>

          <div className="rightContainer fadeIn">
          
            
          </div>
        </div>
      </main>
    );
  }

  if (!session && pageLoading) {
    return <></>;
  }

  return (
   <SignedOut />
  );
};

export default InterviewTips;
