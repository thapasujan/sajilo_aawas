import React from "react";
import { LogIn } from "./login";
import { SignUp } from "./signup";
import { useAuthContext } from "../../hooks";
import { Otp } from "./otp";

export const AuthLayout = React.memo(() => {
  const loginMenu = useAuthContext();

  return (
    <div>
      {loginMenu?.authModalStatus.haveAccount ? (
        <LogIn />
      ) : loginMenu?.authModalStatus.otpSection ? (
        <Otp />
      ) : (
        <SignUp />
      )}
    </div>
  );
});
