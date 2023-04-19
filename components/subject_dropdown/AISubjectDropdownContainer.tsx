import { appStrings } from '@/constants/appStrings'
import React from 'react'
import { SubjectDropdown } from './SubjectDropdown'

interface AISubjectDropdownContainerProps {
  readonly onChange: (value: string) => void;
}

const { getSubjectsPrompt } = appStrings.aiPrompts

export const AISubjectDropdownContainer: React.FC<AISubjectDropdownContainerProps> = ({ onChange }) => {
  const [subjects, setSubjects] = React.useState<ReadonlyArray<string>>([])
  const [defaultValue, setDefaultValue] = React.useState<string>('')

  const fetchSubjects = async() => {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "user", content: getSubjectsPrompt, maxTokens: 400 }),
    });
    const data = await response.json();
    if (data) {
      setSubjects(data.response.content.split('\n'))
    }
  }

  React.useEffect(() => {
    fetchSubjects()
    setDefaultValue(subjects[0])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
    {subjects.length ? <SubjectDropdown dropdownValues={subjects} defaultValue={defaultValue} onChange={onChange} /> : <>Loading</>}</>
  )
}
