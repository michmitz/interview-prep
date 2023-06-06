import React from "react";
import { NextPage } from "next";
import { Sidebar } from "@/components/atoms/sidebar/Sidebar";
import { useSession } from "next-auth/react";
import { SignedOut } from "@/components/molecules/signed_out/SignedOut";


const JobTips: NextPage = () => {
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

export default JobTips;
