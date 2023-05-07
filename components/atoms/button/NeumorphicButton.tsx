import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./NeumorphicButton.module.css";

interface NeumorphicButtonProps {
  readonly text?: string;
  readonly onClick: (val: any | null) => void;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly height: any;
  readonly width: any;
}

export const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  text,
  onClick,
  loading,
  disabled,
  height,
  width,
}) => {
  return (
    <button
      className={styles.button}
      style={{ height, width }}
      disabled={loading || disabled}
      onClick={onClick}
    >
        {loading ? <LoadingOutlined /> : text}
    </button>
  );
};
