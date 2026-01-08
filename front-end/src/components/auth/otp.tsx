import toast, { Toaster } from "react-hot-toast";
import {
  Button,
  InputField,
  LoaderSpinner,
  MediumInfoText,
} from "../../units";
import { MessageSquare } from "react-feather";
import { useState } from "react";
import { useVerifyOTPMutation } from "../../state-management/api/auth-api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { errorTypes } from "../../constant";
import { useAuthContext } from "../../hooks";

export const Otp = () => {
  const [verifyOtpApi, { isLoading: optLoading }] = useVerifyOTPMutation();
  const authContext = useAuthContext();
  const [otp, setOtp] = useState("");

  // Get userId from localStorage (saved during signup)
  const userId = localStorage.getItem("userId");

  const verifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User ID not found. Please signup again.");
      return;
    }

    const sendData = { otp, userId };

    await verifyOtpApi(sendData).then((data) => {
      if (data.error) {
        const error = data.error as FetchBaseQueryError;
        if ("data" in error) {
          toast.error((error.data as errorTypes).message as string);
        }
        if ("error" in error) {
          toast.error("Server timed out. Please Try Again Later!!!");
        }
      }
      if (data.data) {
        toast.success(data.data.msg);
        authContext?.setauthModalStatus({
          ...authContext.authModalStatus,
          otpSection: false,
          haveAccount: true,
        });
      }
    });
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Toaster />
      {optLoading && <LoaderSpinner />}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <MediumInfoText
          title="Verify OTP"
          className="uppercase text-center text-lg sm:text-xl font-semibold mb-6"
        />

        <form onSubmit={verifyOtp} className="flex flex-col gap-6">
          <InputField
            iconname={MessageSquare}
            inputType="text"
            inputValue={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP..."
            required
          />

          <Button type="submit" className="w-full">
            Verify OTP
          </Button>
        </form>
      </div>
    </main>
  );
};
