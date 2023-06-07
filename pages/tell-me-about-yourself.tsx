import React from "react";
import { NextPage } from "next";
import styles from "../styles/TellMeAboutYourself.module.css";
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
  const [aiLoading, setAILoading] = React.useState(false);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>(
    "Sorry, the rate limit per minute has been exceeded. Try again in a minute!"
  );
  const [response, setResponse] = React.useState<any>(null);
  const [answerSaving, setAnswerSaving] = React.useState<boolean>(false);
  const [savingResponse, setSavingResponse] = React.useState<string>("");

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const generateAIPrompt = `Update the following to be a more professional response to the interview prompt "Tell me about yourself": ${answerInput}`;

  const handleGenerateAIClick = async (e: any) => {
    setShowError(false);
    setResponse("");
    setAILoading(true);

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
        setAILoading(false);
        if (data.response.message !== "Request failed with status code 429") {
          setErrorMessage(data.response.message);
        }
        setShowError(true);
      }
    }

    setAILoading(false);
  };

  const handleSaveAnswer = async () => {
    setAnswerSaving(true);
    const data = {
      promptAnswer: answerInput,
    };

    const response = await fetch("/api/tell_me_prompt/create_tell_me_answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log('response', response)

    if (response.status === 200) {
      setAnswerSaving(false);
      setSavingResponse("Answer successfully saved!");
    } else {
      setAnswerSaving(false);
      setSavingResponse("Answer failed to save");
    }
  };

  React.useEffect(() => {
    console.log("saving response", savingResponse)
    console.log("prompt answer", answerInput)
  }, [savingResponse])

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
              Enter your answer below. If you would like the AI to add some
              razzle dazzle, click the Touch Up button.
            </p>
            {/* Add link for notes page */}
            <p>
              Your saved response can be viewed and edited in the Notes page.
            </p>

            <AnswerField
              onChange={(e) => setAnswerInput(e)}
              loading={false}
              disableButton={false}
              placeholder="Write your answer here..."
            />
            {response && <p>{response}</p>}
            <div className={styles.buttonContainer}>
              <div className={styles.saveButton}>
                {" "}
                <NeumorphicButton
                  onClick={handleSaveAnswer}
                  height="25px"
                  width="120px"
                  text="Save"
                />
              </div>
              <NeumorphicButton
                onClick={handleGenerateAIClick}
                height="25px"
                width="120px"
                text={response ? "Regenerate Response" : "Touch Up"}
                disabled={!answerInput || aiLoading}
                loading={aiLoading}
              />
            </div>
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

// Todo:

// Make CRUD routes
// Update prisma model, encrypt answer
// Get any saved input from prisma a la notes page, display below input, handle when no saved data exists
// Add link for notes page
// Fix issue of all elements having user-select:none
// App strings
