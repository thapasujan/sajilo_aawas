import { Link } from "react-router-dom";
import { Sizes, StyleProps } from "../../constant";

interface linkPropTypes extends StyleProps {
  path: string;
  title: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export const NavigateLink = ({
  path,
  title,
  textSize = Sizes.md,
  className,
  onClick = () => console.log("hello"),
}: linkPropTypes) => {
  return (
    <Link
      to={path}
      className={`${textSize} text-text-secondaryBrand ${className}`}
      onClick={(e) => onClick(e)}
    >
      {title}
    </Link>
  );
};
