import { StyleProps, Sizes } from "../../constant/index";

interface mediuminfoTextPropTypes
  extends StyleProps,
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  title: string;
}

export const MediumInfoText = ({
  title,
  className,
  textColor = "text-brand",
  textSize = Sizes.xl,
}: mediuminfoTextPropTypes) => {
  return (
    <article className={`${className}  text-${textColor} ${textSize}  `}>
      {title}
    </article>
  );
};
