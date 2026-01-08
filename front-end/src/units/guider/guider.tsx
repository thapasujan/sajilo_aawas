import { Sizes, StyleProps } from "../../constant";

interface guiderPropTypes extends StyleProps {
  path: string;
  title: string;
  onClick?: () => void; // Add onClick prop
}

export const Guider = ({
  path,
  title,
  textSize = Sizes.md,
  className = "",
  onClick, // Destructure onClick
}: guiderPropTypes) => {
  const handleClick = () => {
    const element = document.getElementById(path);
    element?.scrollIntoView({
      behavior: "smooth",
    });
    
    // Call the additional onClick handler if provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`
        text-${textSize} 
        md:text-${textSize === Sizes.sm ? Sizes.md : textSize} 
        lg:text-${textSize}
        text-text-secondaryBrand 
        ${className} 
        no-underline
        px-2 py-1 md:px-3 md:py-1
        rounded-md
        hover:bg-gray-100 active:bg-gray-200
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-300
      `}
      onClick={handleClick}
      aria-label={`Scroll to ${title}`}
    >
      {title}
    </button>
  );
};