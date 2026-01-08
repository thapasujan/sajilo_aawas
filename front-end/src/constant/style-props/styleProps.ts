import { Sizes } from "./sizes";

interface StyleProps {
  textSize?:
    | Sizes.lg
    | Sizes.md
    | Sizes.sm
    | Sizes.xl
    | Sizes.xlg
    | Sizes.xxl
    | Sizes.xxll;
  fontWeight?: string;
  textColor?: string;
  animationProps?: string;
  cursor?: string;
  iconSize?: number;
  lineHeight?: string;
  width?: string;
  height?: string;
  textDecoration?: string;
  marginTop?: string;
  className?: string;
}

export default StyleProps;
