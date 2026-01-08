import React, { createContext, useState } from "react";

interface propTypes {
  loginMenu: boolean;
  haveAccount: boolean;
  otpSection: boolean;
}

interface contextPropTypes {
  setauthModalStatus: React.Dispatch<React.SetStateAction<propTypes>>;
  authModalStatus: propTypes;
}

export const landingPageContext = createContext<contextPropTypes | null>(null);

interface landingpageContextPropTypes {
  children: React.ReactNode;
}

export const LandingPageContent = React.memo(
  ({ children }: landingpageContextPropTypes) => {
    const [authModalStatus, setauthModalStatus] = useState({
      loginMenu: false,
      haveAccount: true,
      otpSection: false,
    });
    return (
      <landingPageContext.Provider
        value={{ authModalStatus, setauthModalStatus }}
      >
        {children}
      </landingPageContext.Provider>
    );
  }
);
