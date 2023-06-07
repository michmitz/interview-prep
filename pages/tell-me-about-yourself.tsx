import React from "react";
import { NextPage } from "next";
import styles from "../styles/Home.module.css";
import prisma from "@/lib/prisma";
import { Sidebar } from "@/components/atoms/sidebar/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SignedOut } from "@/components/molecules/signed_out/SignedOut";
import { AnswerField } from "@/components/atoms/answer_field/AnswerField";
import { NeumorphicButton } from "@/components/atoms/button/NeumorphicButton";

const TellMeAboutYourself: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const pageLoading = status === "loading";
  const [answerInput, setAnswerInput] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>(
    "Sorry, the rate limit per minute has been exceeded. Try again in a minute!"
  );
  const [response, setResponse] = React.useState<any>(null);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const generateAIPrompt = `Update the following to be a more professional response to the interview prompt "Tell me about yourself": ${answerInput}`;

  const handleGenerateAIClick = async (e: any) => {
    setShowError(false);
    setResponse("");
    setLoading(true);

    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: generateAIPrompt }],
        maxTokens: 250,
      }),
    });

    const data = await response.json();

    if (data) {
      if (data.response.name !== "Error") {
        setResponse(data.response.content);
      } else {
        setLoading(false);
        if (data.response.message !== "Request failed with status code 429") {
          setErrorMessage(data.response.message);
        }
        setShowError(true);
      }
    }

    setLoading(false);
  };

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

            <AnswerField
              onChange={(e) => setAnswerInput(e)}
              onSubmit={() => {}}
              loading={false}
              disableButton={false}
              placeholder="Write your answer here..."
              buttonText="Save"
            />
            {response && <p>{response}</p>}
            <NeumorphicButton
              onClick={handleGenerateAIClick}
              height="25px"
              width="120px"
              text={response ? "Regenerate Response" : "Touch up with AI"}
              disabled={!answerInput || loading}
              loading={loading}
            />
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
