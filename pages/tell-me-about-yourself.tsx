import React from "react";
import styles from "../styles/TellMeAboutYourself.module.css";
import { Sidebar } from "@/components/atoms/sidebar/Sidebar";
import { AnswerField } from "@/components/atoms/answer_field/AnswerField";
import { NeumorphicButton } from "@/components/atoms/button/NeumorphicButton";
import { appStrings } from "@/constants/appStrings";
import Link from "next/link";
import { LoadingOutlined } from "@ant-design/icons";
import { localStorageService } from "@/lib/localStorage";

const {
  sidebarHeader,
  header,
  subHeader,
  subHeaderSavedResponse,
  notesLink,
  showSavedAnswer,
  prevSaved,
  hideAnswer,
  aiResponseHeader,
  fieldPlaceholder,
  noExistingAnswer,
  saveButton,
} = appStrings.tellMePage;
const { rateLimitErr, statusCode429 } = appStrings.errors;
const { tellMePrompt } = appStrings.aiPrompts;
const { answerSaved, answerSaveFailed } = appStrings.apiResponses;

const TellMeAboutYourself: React.FC = () => {
  const [answerInput, setAnswerInput] = React.useState<string>("");
  const [aiLoading, setAILoading] = React.useState(false);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>(rateLimitErr);
  const [aiResponse, setAIResponse] = React.useState<any>(null);
  const [answerSaving, setAnswerSaving] = React.useState<boolean>(false);
  const [apiResponse, setAPIResponse] = React.useState<string>("");
  const [showPreviouslySaved, setShowPreviouslySaved] = React.useState<boolean>(false);
  const [existingAnswer, setExistingAnswer] = React.useState<string | null>(null);

  React.useEffect(() => {
    const savedAnswer = localStorageService.getTellMePrompt();
    if (savedAnswer) {
      setExistingAnswer(savedAnswer.promptAnswer);
    }
  }, []);

  const generateAIPrompt = `${tellMePrompt} ${answerInput}`;

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
        if (data.response.message !== statusCode429) {
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

    const result = localStorageService.saveTellMePrompt(input);
    if (result) {
      setAnswerSaving(false);
      setAIResponse("");
      setAPIResponse(answerSaved);
      setExistingAnswer(result.promptAnswer);
    } else {
      setAnswerSaving(false);
      setAPIResponse(answerSaveFailed);
    }
  };

  return (
    <main className="lightGlassEffect">
      <div className="container">
        <div className="sidebar">
          <Sidebar
            headerText={sidebarHeader}
            isLoggedIn={true}
          />
        </div>

        <div className="rightContainer">
          <p className={`${styles.header} greenGradient`}>{header}</p>
          <div className={styles.subHeader}>
            <p>
              {subHeader}
              {subHeaderSavedResponse}{" "}
              <Link href="/notes" className={styles.link}>
                {notesLink}
              </Link>{" "}
              page.
            </p>
            <p className={styles.subHeaderToggleAnswer}>
              {!existingAnswer ? (
                noExistingAnswer
              ) : (
                <button
                  onClick={() => setShowPreviouslySaved(true)}
                  className={`${styles.showHideButton} ${styles.greenButtonOutline}`}
                >
                  {showSavedAnswer}
                </button>
              )}
            </p>
          </div>

          <AnswerField
            onChange={(e) => setAnswerInput(e)}
            loading={false}
            disableButton={false}
            placeholder={fieldPlaceholder}
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
                {prevSaved}
                <button
                  onClick={() => setShowPreviouslySaved(false)}
                  className={`${styles.showHideButton} ${styles.purpleButtonOutline}`}
                >
                  {hideAnswer}
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
                {aiResponseHeader}
                <button
                  onClick={() => handleSaveAnswer(aiResponse)}
                  className={`${styles.showHideButton} ${styles.purpleButtonOutline}`}
                  disabled={answerSaving}
                >
                  {answerSaving ? <LoadingOutlined /> : saveButton}
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
};

export default TellMeAboutYourself;
