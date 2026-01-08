import React from "react";
import { HeaderInfoText, InfoText } from "../../../../units";

export const BrandDetails = React.memo(() => {
  return (
    <div className="flex flex-col gap-8 bg-brand rounded-xl p-6 ">
      <HeaderInfoText
        title="Stay Longer, Save More"
        className="text-other-white-200 "
      />
      <InfoText
        title="It's Simple: search, explore & contact!"
        className="text-other-white-100"
      />
      <div className="flex flex-col gap-4  border-l-2 border-other-white-100 p-4 ">
        <InfoText
          title="Find the best room that fits your budget & personality"
          className="text-other-white-100 animate-fadeindown"
        />
        <InfoText
          title="Save upto 30%. Connect with the best in the game"
          className="text-other-white-100 animate-fadeindown"
        />
      </div>
    </div>
  );
});
