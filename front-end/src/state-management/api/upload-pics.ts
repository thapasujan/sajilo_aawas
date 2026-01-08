import { upload_Cloud_URL } from "../../constant/url/url";
import { MainApi } from "./ApiGateway";

const UploadApi = MainApi.injectEndpoints({
  endpoints: (builder) => ({
    cloudinaryStorage: builder.mutation({
      query: (data) => ({
        url: `${upload_Cloud_URL}`,
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

export const { useCloudinaryStorageMutation } = UploadApi;
