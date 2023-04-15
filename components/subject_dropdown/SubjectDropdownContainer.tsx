import { appStrings } from '@/constants/appStrings'
import React from 'react'
import { SubjectDropdown } from './SubjectDropdown'

const { getSubjectsPrompt } = appStrings.aiPrompts

export const SubjectDropdownContainer: React.FC = () => {
  const [subjects, setSubjects] = React.useState<ReadonlyArray<string>>([])

  const fetchSubjects = async() => {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "user", content: getSubjectsPrompt, maxTokens: 400 }),
    });
    const data = await response.json();
    const subjectsArr = data?.response.content.split('\n')
    setSubjects(subjectsArr);
  }

  React.useEffect(() => {
    fetchSubjects()
    console.log('Subjects', subjects)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
    {subjects.length ? <SubjectDropdown dropdownValues={subjects}/> : <>Loading</>}</>
  )
}
