import React from "react";
import { Link } from "react-router-dom";
import { InfoText } from "../info-text-info/info-text";
import { Icon } from "../icons/icons";
import { ChevronsRight, Home } from "react-feather";

interface BreadCrumbsPropTypes {
  children?: React.ReactNode;
}

export const BreadCrumbs = React.memo(({ children }: BreadCrumbsPropTypes) => {
  return (
    <main className="flex place-items-center gap-2">
      <Icon name={Home} iconSize={18} />
      <Link to="/" className="flex place-items-center text-brand ">
        <InfoText title="Home" />
        <Icon name={ChevronsRight} />
      </Link>
      {children}
    </main>
  );
});
