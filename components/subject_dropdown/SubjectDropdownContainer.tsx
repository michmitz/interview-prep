import React from "react";
import { SubjectDropdown } from "./SubjectDropdown";

interface SubjectDropdownContainerProps {
  readonly onChange: (value: string) => void;
  readonly subjects: ReadonlyArray<string>;
}

export const SubjectDropdownContainer: React.FC<
  SubjectDropdownContainerProps
> = ({ onChange, subjects }) => {
  return (
    <SubjectDropdown
      dropdownValues={subjects}
      defaultValue={subjects[0]}
      onChange={onChange}
    />
  );
};
