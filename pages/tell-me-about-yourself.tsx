import React from "react";
import { GetServerSideProps, NextPage } from "next";
import styles from "../styles/TellMeAboutYourself.module.css";
import prisma from "@/lib/prisma";
import { Sidebar } from "@/components/atoms/sidebar/Sidebar";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SignedOut } from "@/components/molecules/signed_out/SignedOut";
import { AnswerField } from "@/components/atoms/answer_field/AnswerField";
import { NeumorphicButton } from "@/components/atoms/button/NeumorphicButton";
import { appStrings } from "@/constants/appStrings";
import Link from "next/link";
import { LoadingOutlined } from "@ant-design/icons";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { tellMePrompt: {} } };
  }

  const tellMeAnswer = await prisma.tellMePrompt.findFirst({
    where: {
      author: { email: session?.user?.email },
    },
  });

  const existingAnswer = tellMeAnswer?.promptAnswer || null;

  return {
    props: { existingAnswer },
  };
};

const { header, subHeader } = appStrings.tellMePage;

interface TellMeAboutYourselfProps {
  readonly existingAnswer: string;
}

const TellMeAboutYourself: NextPage<TellMeAboutYourselfProps> = ({
  existingAnswer,
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const pageLoading = status === "loading";
  const [answerInput, setAnswerInput] = React.useState<string>("");
  const [aiLoading, setAILoading] = React.useState(false);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>(
    "Sorry, the rate limit per minute has been exceeded. Try again in a minute!"
  );
  const [aiResponse, setAIResponse] = React.useState<any>(null);
  const [answerSaving, setAnswerSaving] = React.useState<boolean>(false);
  const [apiResponse, setAPIResponse] = React.useState<string>("");
  const [showPreviouslySaved, setShowPreviouslySaved] =
    React.useState<boolean>(false);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const generateAIPrompt = `Update the following to be a fairly brief and more professional response to the interview prompt "Tell me about yourself": ${answerInput}`;

  const handleGenerateAIClick = async (e: any) => {
    setShowError(false);
    setAIResponse("");
    setAILoading(true);

    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: generateAIPrompt }],
        maxTokens: 300,
      }),
    });

    const data = await response.json();

    if (data) {
      if (data.response.name !== "Error") {
        setAIResponse(data.response.content);
      } else {
        setAILoading(false);
        if (data.response.message !== "Request failed with status code 429") {
          setErrorMessage(data.response.message);
        }
        setShowError(true);
      }
    }

    setAILoading(false);
  };

  const handleSaveAnswer = async (input: string) => {
    setAPIResponse("");
    setAnswerSaving(true);
    const data = {
      promptAnswer: input,
    };

    const response = await fetch("/api/tell_me_prompt/create_tell_me_answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("response", response);

    if (response.status === 200) {
      setAnswerSaving(false);
      setAIResponse("");
      setAPIResponse("Answer successfully saved!");
      refreshData();
    } else {
      setAnswerSaving(false);
      setAPIResponse("Answer failed to save");
    }
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
            <p className={`${styles.header} greenGradient`}>{header}</p>
            <div className={styles.subHeader}>
              <p>
                {subHeader}
                Your saved response can be viewed and edited in the{" "}
                <Link href="/notes" className={styles.link}>
                  Notes
                </Link>{" "}
                page.
              </p>
              <p className={styles.subHeaderToggleAnswer}>
                {!existingAnswer ? (
                  "You currently have no answer saved."
                ) : (
                  <button
                    onClick={() => setShowPreviouslySaved(true)}
                    className={`${styles.showHideButton} ${styles.greenButtonOutline}`}
                  >
                    Show Saved Answer
                  </button>
                )}
              </p>
            </div>

            <AnswerField
              onChange={(e) => setAnswerInput(e)}
              loading={false}
              disableButton={false}
              placeholder="Write your answer here..."
            />
            <div className={styles.buttonContainer}>
              <div className={styles.saveButton}>
                {" "}
                <NeumorphicButton
                  onClick={() => handleSaveAnswer(answerInput)}
                  height="25px"
                  width="120px"
                  text="Save"
                  disabled={answerSaving || !answerInput}
                  loading={answerSaving}
                />
              </div>
              <NeumorphicButton
                onClick={handleGenerateAIClick}
                height="25px"
                width="120px"
                text={aiResponse ? "Regenerate" : "Touch Up"}
                disabled={!answerInput || aiLoading}
                loading={aiLoading}
              />
            </div>

            {existingAnswer && showPreviouslySaved && (
              <div
                className={`${styles.answerContainer} lightGlassEffect quickFadeIn`}
              >
                <p className={`${styles.answerHeader} whiteGradient`}>
                  Previously Saved Answer:
                  <button
                    onClick={() => setShowPreviouslySaved(false)}
                    className={`${styles.showHideButton} ${styles.purpleButtonOutline}`}
                  >
                    Hide Answer
                  </button>
                </p>
                <p className={styles.answerText}>{existingAnswer}</p>
              </div>
            )}

            {aiResponse && (
              <div
                className={`${styles.answerContainer} ${styles.aiAnswerContainer} lightGlassEffect quickFadeIn`}
              >
                <p className={`${styles.answerHeader} whiteGradient`}>
                  AI Reponse:
                  <button
                    onClick={() => handleSaveAnswer(aiResponse)}
                    className={`${styles.showHideButton} ${styles.purpleButtonOutline}`}
                    disabled={answerSaving}
                  >
                    {answerSaving ? (
                      <LoadingOutlined />
                    ) : (
                      "Save (Override existing answer)"
                    )}
                  </button>
                </p>
                <p className={styles.answerText}>{aiResponse}</p>
              </div>
            )}

            {apiResponse && (
              <div className="noteResponseContainer">
                <div className={`noteResponse mutedPurpleGradient`}>
                  {apiResponse}
                </div>
              </div>
            )}

            {showError && (
              <div className="noteResponseContainer">
                <div className={`noteResponse mutedPurpleGradient`}>
                  {errorMessage}
                </div>
              </div>
            )}
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
