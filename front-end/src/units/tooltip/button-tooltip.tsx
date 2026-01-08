import React from "react";
import { Button, Icon, InfoText } from "../index";
import * as icons from "react-feather";

interface buttonTooltipPropTypes {
  tipInfo: string;
  icon: icons.Icon;
}

export const ButtonToolTip = React.memo(
  ({ tipInfo, icon }: buttonTooltipPropTypes) => {
    return (
      <div className="group/item">
        <InfoText
          title={tipInfo}
          className="invisible bg-dark p-2 font-thin text-sm  group-hover/item:visible -mb-8 mr-2 mt-2 group-hover:animate-fadeindown"
        />
        <Button className=" flex place-items-center bg-white mt-10 outline-none font-[500] p-4 max-w-56 gap-2 rounded-lg hover:animate-jiggle">
          <Icon name={icon} />
        </Button>
      </div>
    );
  }
);
