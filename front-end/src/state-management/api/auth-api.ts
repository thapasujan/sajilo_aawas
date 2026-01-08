import { Auth_URL } from "../../constant";
import { MainApi } from "./ApiGateway";

const AuthApi = MainApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data) => ({
        url: `${Auth_URL}/create`,
        method: "POST",
        body: data,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: `${Auth_URL}/verify-otp`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("signuptoken") as string
          )}`,
        },
      }),
    }),
    logIn: builder.mutation({
      query: (data) => ({
        url: `${Auth_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),

    // 🔑 Forgot password (sends email)
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${Auth_URL}/forgot-password`,
        method: "POST",
        body: data, // { email }
      }),
    }),

    // 🔑 Reset password (validate token + update)
    resetPassword: builder.mutation({
      query: ({ token, password }: { token: string; password: string }) => ({
        url: `${Auth_URL}/reset-password/${token}`,
        method: "POST",
        body: { password },
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useLogInMutation,
  useVerifyOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = AuthApi;
