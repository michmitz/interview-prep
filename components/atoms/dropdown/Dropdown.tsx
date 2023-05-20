import React, { useEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.css";
import { CaretDownOutlined } from "@ant-design/icons";
import { appStrings } from "@/constants/appStrings";

export interface DropdownProps {
  readonly defaultValue: any;
  readonly dropdownValues: ReadonlyArray<any>;
  readonly onChange?: (value: any) => void;
  readonly variant: "mode" | "software-question-types";
}

const { modeLabel, softwareQuestionTypeLabel } = appStrings.header;

export const Dropdown: React.FC<DropdownProps> = ({
  defaultValue,
  dropdownValues,
  onChange,
  variant,
}) => {
  const softwareMode = variant === "software-question-types";
  const ref = useRef<any>();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (showMenu && ref.current && !ref.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showMenu]);

  return (
    <div className={styles.container}>
      {softwareMode ? (
        <span className={styles.softwareQuestionLabel}>{softwareQuestionTypeLabel}:</span>
      ) : (
        <span className={styles.label}>{modeLabel}:</span>
      )}
      <div className={styles.dropdownContainer}>
        <div
          className={`${styles.dropdownHeader} ${
            variant === "mode" ? "blueGradient" : `${styles.softwareDropdownHeader} greenGradient`
          }`}
          onClick={() => setShowMenu(true)}
        >
          {defaultValue}
          <CaretDownOutlined />
        </div>
        {showMenu && (
          <ul className={styles.listContainer} ref={ref}>
            {dropdownValues.map((value) => {
              return (
                <li
                  value={value}
                  key={value}
                  className={styles.li}
                  onClick={() => {
                    onChange && onChange(value);
                    setShowMenu(false);
                  }}
                >
                  {value}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
