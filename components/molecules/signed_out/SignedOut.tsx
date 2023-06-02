import React from "react";
import { appStrings } from "@/constants/appStrings";
import { SpeechBubblePrompt } from "../speech_bubble_prompt/SpeechBubblePrompt";
import { signIn } from "next-auth/react";

const { notSignedInText, signInButtonText } = appStrings.speechBubble;

export const SignedOut: React.FC = () => {
  return (
    <div
      style={{
        backgroundImage: `url('/backgrounds/background-1.jpg')`,
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        overflow: "auto",
        minHeight: "650px",
      }}
      className="centerContent"
    >
      <div className="signedOut">
          <SpeechBubblePrompt
            text={notSignedInText}
            onClick={() => signIn()}
            buttonText={signInButtonText}
          />
        </div>
    </div>
  );
};
