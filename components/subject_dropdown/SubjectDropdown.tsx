import React from "react";
import styles from './SubjectDropdown.module.css'

export interface SubjectDropdownProps {
  readonly dropdownValues: ReadonlyArray<string>
}

export const SubjectDropdown: React.FC<SubjectDropdownProps> = ({
  dropdownValues,
}) => {
  return (
    <div className={styles.container}>
      <select>
        {dropdownValues.map((value) => {
          return <option value={value} key={value}>{value}</option>
        })}
      </select>
    </div>
  )
}
