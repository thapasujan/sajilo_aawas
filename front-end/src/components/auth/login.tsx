import React from "react";
import { Button, InfoText, MediumInfoText } from "../../units";
import { Lock, Mail } from "react-feather";
import { InputField } from "../../units/input-field/input-field";
import { useDispatch } from "react-redux";
import { useLogInMutation } from "../../state-management/api/auth-api";
import { logIn } from "../../state-management/local/auth";
import { useAuthContext } from "../../hooks";
import toast, { Toaster } from "react-hot-toast";
import LoaderSpinner from "../../units/loader/loader-spinner";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { errorTypes } from "../../constant";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

// ✅ Yup schema for validation
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const LogIn = React.memo(() => {
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLogInMutation();

  const loginFunc = async (values: { email: string; password: string }) => {
    await login(values).then((data) => {
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
        const toStore = {
          token: data?.data?.token,
          user: data?.data?.user ?? null,
        };
        dispatch(logIn(toStore));
        authContext?.setauthModalStatus({
          ...authContext.authModalStatus,
          loginMenu: false,
        });
      }
    });
  };

  return (
    <main className="flex justify-center items-center lg:px-4">
      <Toaster />
      {isLoading && <LoaderSpinner />}

      <div className="w-full max-w-md lg:p-6 sm:p-8">
        <MediumInfoText
          title="Sign In"
          className="uppercase text-center text-lg sm:text-lg font-semibold mb-6"
        />

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={loginFunc}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form className="flex flex-col gap-5">
              <InputField
                iconname={Mail}
                inputName="email"
                inputType="text"
                inputValue={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email..."
                error={errors.email}
                touched={touched.email}
              />

              <InputField
                iconname={Lock}
                inputName="password"
                inputType="password"
                inputValue={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password..."
                error={errors.password}
                touched={touched.password}
              />

              <Button className="w-full mt-2" type="submit">
                Log In
              </Button>
            </Form>
          )}
        </Formik>

        <hr className="bg-[#ADADAD] w-full bg-opacity-[.5] my-6" />

        <Button
          type="button"
          className="w-full bg-fav"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password
        </Button>

        <div className="flex justify-center items-center gap-2 mt-6">
          <InfoText title="New Here ?" />
          <InfoText
            title="Sign up"
            className="hover:animate-glow cursor-pointer"
            onClick={() =>
              authContext?.setauthModalStatus({
                ...authContext.authModalStatus,
                haveAccount: false,
              })
            }
          />
        </div>
      </div>
    </main>
  );
});
