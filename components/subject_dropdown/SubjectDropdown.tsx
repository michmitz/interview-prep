import React from "react";

export interface SubjectDropdownProps {
  readonly dropdownValues: ReadonlyArray<string>
}

export const SubjectDropdown: React.FC<SubjectDropdownProps> = ({
  dropdownValues,
}) => {
  return (
    <div>
      <select>
        {dropdownValues.map((value) => {
          return <option value={value} key={value}>{value}</option>
        })}
      </select>
    </div>
  )
}
