import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { errorTypes } from "../interface/errorInterface";
import toast from "react-hot-toast";
import { SerializedError } from "@reduxjs/toolkit";

interface propTypes {
  data:
    | FetchBaseQueryError
    | SerializedError
    | undefined
    | string
    | number
    | unknown;
}

export const ErrorHandler = ({ data }: propTypes) => {
  const error = data as FetchBaseQueryError;

  if ("data" in error) {
    toast.error((data as errorTypes).message as string);
  }
  if ("status" in error) {
    toast.error("Server timed out. Please Try Again Later!!!");
  }
};
