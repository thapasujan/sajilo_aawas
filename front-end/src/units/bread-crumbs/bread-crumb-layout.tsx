import React from "react";
import { Link } from "react-router-dom";
import { InfoText } from "../info-text-info/info-text";
import { Icon } from "../icons/icons";
import { ChevronsRight } from "react-feather";

interface layoutPropTypes {
  path: string;
  title: string;
  current?: boolean;
}

export const BreadCrumbLayout = React.memo(
  ({ path, title, current }: layoutPropTypes) => {
    return (
      <main>
        <Link
          to={path}
          className={`flex place-items-center ${
            current ? "text-secondary" : "text-brand"
          }`}
        >
          <InfoText title={title} />
          <Icon name={ChevronsRight} />
        </Link>
      </main>
    );
  }
);
