import React from "react";
import { appStrings } from "@/constants/appStrings";
import { SpeechBubblePrompt } from "../speech_bubble_prompt/SpeechBubblePrompt";
import { signIn } from "next-auth/react";

const { notSignedInText, signInButtonText } = appStrings.speechBubble;

export const SignedOut: React.FC = () => {
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
