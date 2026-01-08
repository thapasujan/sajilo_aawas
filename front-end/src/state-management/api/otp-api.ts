import { OTP_API } from "../../constant/url/url";
import { MainApi } from "./ApiGateway";

const OtpApi = MainApi.injectEndpoints({
  endpoints: (builder) => ({
    getOTP: builder.mutation({
      query: (data) => ({
        url: `${OTP_API}/get-otp`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
      }),
    }),
  }),
});

export const { useGetOTPMutation } = OtpApi;
