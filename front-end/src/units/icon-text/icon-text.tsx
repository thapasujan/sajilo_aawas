import * as icon from "react-feather";
import { InfoText, Icon } from "../";
import React from "react";

interface propTypes {
  icon: icon.Icon;
  text: string;
}

export const IconWithText = React.memo(({ icon, text }: propTypes) => {
  return (
    <section className="flex place-items-center gap-4">
      <Icon name={icon} />
      <InfoText title={text} />
    </section>
  );
});
