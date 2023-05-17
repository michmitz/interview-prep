import React, { useEffect, useRef, useState } from "react";
import styles from "./ModeDropdown.module.css";
import { InterviewMode } from "../sidebar/Sidebar";
import { CaretDownOutlined } from "@ant-design/icons";
import { appStrings } from "@/constants/appStrings";

export interface ModeDropdownProps {
  readonly defaultValue: InterviewMode;
  readonly dropdownValues: ReadonlyArray<InterviewMode>;
  readonly onChange: (value: InterviewMode) => void;
}

const { modeLabel } = appStrings.header

export const ModeDropdown: React.FC<ModeDropdownProps> = ({
  defaultValue,
  dropdownValues,
  onChange,
}) => {
  const ref = useRef<any>()
  const [showMenu, setShowMenu] = useState<boolean>(false)

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (showMenu && ref.current && !ref.current.contains(e.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", checkIfClickedOutside)

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [showMenu])

  return (
    <div className={styles.container}>
      <span className={styles.label}>{modeLabel}:</span>
      <div className={styles.dropdownContainer}>
      <div
        className={`${styles.dropdownHeader} blueGradient`}
        onClick={() => setShowMenu(true)}
      >
        {defaultValue}
        <CaretDownOutlined />
      </div>
      {showMenu && 
        <ul className={styles.listContainer} ref={ref}>
          {dropdownValues.map((value) => {
            return (
              <li
                value={value}
                key={value}
                className={styles.li}
                onClick={() => {
                  onChange(value);
                  setShowMenu(false);
                }}
              >
                {value}
              </li>
            );
          })}
        </ul>}
        </div>
    </div>
  );
};
