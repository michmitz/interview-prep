import React from "react";
import { NextPage } from "next";
import { Sidebar } from "@/components/atoms/sidebar/Sidebar";
import { useSession } from "next-auth/react";
import { SignedOut } from "@/components/molecules/signed_out/SignedOut";
import { ThinkingRobot } from "@/components/molecules/thinking_robot/ThinkingRobot";
import { SpeechBubblePrompt } from "@/components/molecules/speech_bubble_prompt/SpeechBubblePrompt";
import styles from "../styles/InterviewTips.module.css";
import { appStrings } from "@/constants/appStrings";

const { header } = appStrings.interviewTipsPage;

const InterviewTips: NextPage = () => {
  const { data: session, status } = useSession();
  const [response, setResponse] = React.useState<any>(null);
  const [interviewTips, setInterviewTips] =
    React.useState<ReadonlyArray<string> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>(
    "Sorry, the rate limit per minute has been exceeded. Try again in a minute!"
  );

  React.useEffect(() => {
    setLoading(true);
    if (!interviewTips) {
      fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "Give me an array of 15 job interview tips.",
            },
          ],
          maxTokens: 400,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.response.name !== "Error") {
            setResponse(data);
            setLoading(false);
          } else {
            setLoading(false);
            if (
              data.response.message !== "Request failed with status code 429"
            ) {
              setErrorMessage(data.response.message);
            }
            setShowError(true);
          }
        });
    }
  }, [interviewTips]);

  React.useEffect(() => {
    if (response) {
      console.log("response", response.response.content.split("\n"));
      setInterviewTips(response.response.content.split("\n"));
    }
  }, [response]);

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
            <p className={`${styles.header} greenGradient`}>{header}</p>
            {response && interviewTips ? (
              <div className={`${styles.tipsContainer}`}>
                {interviewTips.map((tip, i) => {
                  return (
                    <p key={i} className={styles.tip}>
                      {tip}
                    </p>
                  );
                })}
              </div>
            ) : loading ? (
              <div className={`${styles.noDataContainer} flexCenter`}>
                <ThinkingRobot />
              </div>
            ) : showError ? (
              <div className={`${styles.noDataContainer} flexCenter`}>
                <SpeechBubblePrompt text={errorMessage} />
              </div>
            ) : (
              <></>
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

export default InterviewTips;
