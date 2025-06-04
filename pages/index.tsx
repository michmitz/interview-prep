import React from "react";
import type { NextPage } from "next";
import { appStrings } from "@/constants/appStrings";
import { InterviewMode, Sidebar } from "@/components/atoms/sidebar/Sidebar";
import { ContentContainer } from "@/components/molecules/content_container/ContentContainer";
const { welcome } = appStrings.sidebar;

const Home: NextPage = () => {
  const [mode, setMode] = React.useState<InterviewMode>("software");
  const [completion, setCompletion] = React.useState<string>("");
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


    return (
      <main className="lightGlassEffect">
        <div className="container">
          <div className="sidebar">
            <Sidebar
              headerText={welcome}
              mode={mode}
              onModeClick={handleModeClick}
              isLoggedIn={true}
              softwareQuestionType={softwareQuestionType}
              setSoftwareQuestionType={handleChangeSoftwareQuestionType}
            />
          </div>

          <div className="rightContainer fadeIn">
            <ContentContainer
              mode={mode}
              completion={completion}
              setCompletion={setCompletion}
              softwareQuestionType={softwareQuestionType}
              techQuestionSubject={techQuestionSubject}
              setTechQuestionSubject={setTechQuestionSubject}
            />
          </div>
        </div>
      </main>
    );
  }


export default Home;
