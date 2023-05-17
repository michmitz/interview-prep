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
  const { data: session } = useSession();
  const [mode, setMode] = React.useState<InterviewMode>("software");
  const [completion, setCompletion] = React.useState<string>("");
  const [noteResponse, setNoteResponse] = React.useState<string>("");
  const [softwareQuestionType, setSoftwareQuestionType] = React.useState<string>("any");

  const handleModeClick = (mode: InterviewMode) => {
    setCompletion("");
    setMode(mode);
  };

  if (session) {
    return (
      <div className="container">
        <div className="sidebar">
          <Sidebar
            headerText={welcome}
            mode={mode}
            onModeClick={handleModeClick}
            isLoggedIn={true}
            user={session?.user?.email}
            softwareQuestionType={softwareQuestionType}
            setSoftwareQuestionType={setSoftwareQuestionType}
          />
        </div>

        <div className="rightContainer">
          <ContentContainer
            mode={mode}
            completion={completion}
            setCompletion={setCompletion}
            noteResponse={noteResponse}
            setNoteResponse={setNoteResponse}
          />
          {noteResponse && (
            <div className="speechBubbleSlide">
              <SpeechBubblePrompt text={noteResponse} />
            </div>
          )}
        </div>
      </div>
    );
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
