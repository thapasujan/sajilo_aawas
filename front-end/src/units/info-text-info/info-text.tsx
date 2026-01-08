import { StyleProps, Sizes } from "../../constant/index";

interface infoTextPropTypes extends StyleProps {
  title: string;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const InfoText = ({
  title,
  className,
  textColor = "text-secondaryBrand",
  textSize = Sizes.md,
  onClick,
}: infoTextPropTypes) => {
  return (
    <article
      className={`${className}  ${textColor} ${textSize}  `}
      onClick={onClick}
    >
      {title}
    </article>
  );
};
