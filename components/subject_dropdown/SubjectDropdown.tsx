import React from "react";
import styles from './SubjectDropdown.module.css'

export interface SubjectDropdownProps {
  readonly defaultValue: string
  readonly dropdownValues: ReadonlyArray<string>
  readonly onChange: (value: string) => void;
}

export const SubjectDropdown: React.FC<SubjectDropdownProps> = ({
  defaultValue,
  dropdownValues,
  onChange,
}) => {
  return (
    <div className={styles.container}>
      <select value={defaultValue} onChange={e => onChange(e.target.value)}>
        {dropdownValues.map((value) => {
          return <option value={value} key={value}>{value}</option>
        })}
      </select>
    </div>
  )
}
