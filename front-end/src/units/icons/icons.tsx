import * as icon from "react-feather";
import { StyleProps } from "../../constant";
import React from "react";

interface IconPropTypes extends StyleProps {
  name: icon.Icon;
  onClick?: () => void;
  cursor?: string;
  className?: string;
}

export const Icon = React.memo(
  ({
    name,
    iconSize = 26,
    onClick,
    cursor = "pointer",
    textColor = "#111111",
    className = "hover:animate-jiggle",
  }: IconPropTypes) => {
    const Names = name;
    return (
      <Names
        size={iconSize}
        color={textColor}
        cursor={cursor}
        onClick={onClick}
        className={className}
      />
    );
  }
);
