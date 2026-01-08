import { useContext } from "react";
import { landingPageContext } from "./LandingPageContext";

export const useAuthContext = () => {
  const authContext = useContext(landingPageContext);
  return authContext;
};
