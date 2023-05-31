import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./RaisedButton.module.css";

interface ButtonProps {
  readonly text?: string;
  readonly onClick: (val: any | null) => void;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly height: any;
  readonly width: any;
  readonly customBackground?: any;
}

export const RaisedButton: React.FC<ButtonProps> = ({
  text,
  onClick,
  loading,
  disabled,
  height,
  width,
  customBackground,
}) => {
  const { background, front } = styles;
  const backgroundStyles = customBackground
    ? `${background} ${customBackground}`
    : `${background} greenGradient`;

  return (
    <button
      className={`${backgroundStyles}`}
      style={{ height, width }}
      disabled={loading || disabled}
      onClick={onClick}
    >
      <span className={`${front} lightGlassEffect`} style={{ height, width }}>
        {loading || disabled ? <LoadingOutlined /> : text}
      </span>
    </button>
  );
};
