import React from "react";

interface showImgPropTypes {
  img: string;
  height?: string;
  classname?: string;
  width?: string;
}

export const ShowImg = React.memo(
  ({ img, height, width = "100%", classname }: showImgPropTypes) => {
    return (
      <div
        style={{
          backgroundImage: `url(${img})`,
          width: width,
          height: height,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className={`rounded-2xl hover:animate-pulsing cursor-pointer ${classname}`}
      />
    );
  }
);
