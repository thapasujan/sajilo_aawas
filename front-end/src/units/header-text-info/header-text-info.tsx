import { StyleProps } from "../../constant/index";

interface headerTextPropTypes extends StyleProps {
  title: string;
}

export const HeaderInfoText = ({
  title,
  className,
  textColor = "black",
  fontWeight = "semibold",
}: headerTextPropTypes) => {
  return (
    <article
      className={`${className} font-${fontWeight} text-4xl text-${textColor} `}
    >
      {title}
    </article>
  );
};
