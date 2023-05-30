import React from "react";
import type { NextPage } from "next";
import { appStrings } from "@/constants/appStrings";
import { InterviewMode, Sidebar } from "@/components/atoms/sidebar/Sidebar";
import { useSession, signIn } from "next-auth/react";
import { SpeechBubblePrompt } from "@/components/molecules/speech_bubble_prompt/SpeechBubblePrompt";
import { ContentContainer } from "@/components/molecules/content_container/ContentContainer";

const { welcome } = appStrings.header;
const { notSignedInText, signInButtonText } = appStrings.speechBubble;

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const pageLoading = status === "loading";
  const [mode, setMode] = React.useState<InterviewMode>("software");
  const [completion, setCompletion] = React.useState<string>("");
  const [noteResponse, setNoteResponse] = React.useState<string>("");
  const [softwareQuestionType, setSoftwareQuestionType] =
    React.useState<string>("any");
  const [techQuestionSubject, setTechQuestionSubject] =
    React.useState<string>("");

  const handleModeClick = (mode: InterviewMode) => {
    setCompletion("");
    if (mode !== "software") {
      setTechQuestionSubject("");
      setSoftwareQuestionType("any");
    }
    setMode(mode);
  };

  const handleChangeSoftwareQuestionType = (questionType: string) => {
    setCompletion("");
    if (questionType !== "technical (subject)") {
      setTechQuestionSubject("");
    }
    setSoftwareQuestionType(questionType);
  };

  if (session) {
    return (
      <main className="lightGlassEffect">
        <div className="container">
          <div className="sidebar">
            <Sidebar
              headerText={welcome}
              mode={mode}
              onModeClick={handleModeClick}
              isLoggedIn={true}
              user={session?.user?.email}
              softwareQuestionType={softwareQuestionType}
              setSoftwareQuestionType={handleChangeSoftwareQuestionType}
            />
          </div>

          <div className="rightContainer fadeIn">
            <ContentContainer
              mode={mode}
              completion={completion}
              setCompletion={setCompletion}
              noteResponse={noteResponse}
              setNoteResponse={setNoteResponse}
              softwareQuestionType={softwareQuestionType}
              techQuestionSubject={techQuestionSubject}
              onTechQuestionSubjectChange={setTechQuestionSubject}
            />
            {noteResponse && (
              <div className="speechBubbleSlide">
                <SpeechBubblePrompt text={noteResponse} />
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

  return (
    <div className="signedOut">
      <SpeechBubblePrompt
        text={notSignedInText}
        onClick={() => signIn()}
        buttonText={signInButtonText}
      />
    </div>
  );
};

export default Home;
