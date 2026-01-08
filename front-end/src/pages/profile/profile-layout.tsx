import { Outlet, useLocation } from "react-router-dom";
import { SideBar } from "../../components";
import { BreadCrumbLayout, BreadCrumbs } from "../../units";

export const ProfileLayout = () => {
  const location = useLocation();
  const path = location.pathname.split("/");

  return (
    <div className="flex flex-col gap-2 p-8">
      <header>
        <BreadCrumbs>
          <BreadCrumbLayout
            path={location.pathname}
            title={path.length === 2 ? path[1] : path[2]}
            current={true}
          />
        </BreadCrumbs>
      </header>
      <div className="flex  gap-6 p-4">
        <SideBar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
