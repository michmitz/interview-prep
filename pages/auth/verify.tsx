import { SpeechBubblePrompt } from "@/components/molecules/speech_bubble_prompt/SpeechBubblePrompt";

const Verify = () => {
  return (
      <div className="signedOut">
        <SpeechBubblePrompt text="Check your email for a link to sign in!" />
      </div>
  );
};

export default Verify;
