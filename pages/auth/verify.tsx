import { SpeechBubblePrompt } from "@/components/molecules/speech_bubble_prompt/SpeechBubblePrompt";

const Verify = () => {
  // useEffect(() => {
  //   if (session) {
  //     router.push("/");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [session]);

  return (
    <div
      style={{
        backgroundImage: `url('/background-1.jpg')`,
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        overflow: "auto",
        minHeight: "650px",
      }}
      className="centerContent"
    >
      <div className="signedOut">
        <SpeechBubblePrompt text="Check your email for a link to sign in!" />
      </div>
    </div>
  );
};

export default Verify;
