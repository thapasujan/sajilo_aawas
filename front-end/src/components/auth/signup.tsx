import React from "react";
import { Button, InfoText, MediumInfoText } from "../../units";
import { Lock, Mail, Navigation, Phone, User } from "react-feather";
import { InputField } from "../../units/input-field/input-field";
import { AreaData, errorTypes, role } from "../../constant";
import { useSignUpMutation } from "../../state-management/api/auth-api";
import toast, { Toaster } from "react-hot-toast";
import LoaderSpinner from "../../units/loader/loader-spinner";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuthContext } from "../../hooks";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// ✅ Yup schema
const SignUpSchema = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  contact: Yup.string()
    .matches(/^(97|98)\d{8}$/, "Enter a valid Nepali number (10 digits, starting with 97 or 98)")
    .required("Contact is required"),
  address: Yup.string().required("Address is required"),
  role: Yup.string().required("Role is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must be at least 6 characters and include uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
});

export const SignUp = React.memo(() => {
  const authContext = useAuthContext();
  const [create, { isLoading }] = useSignUpMutation();

  const createAccount = async (values: any) => {
    await create(values).then((data) => {
      if (data.error) {
        const error = data.error as FetchBaseQueryError;
        if ("data" in error) {
          toast.error((error.data as errorTypes).message as string);
        } else {
          toast.error("Server timed out. Please Try Again Later!!!");
        }
      }
      if (data.data) {
        toast.success(data.data.msg);
        localStorage.setItem("signuptoken", JSON.stringify(data.data.token));
        localStorage.setItem("userId", data.data.userId); // ✅ store userId for OTP

        authContext?.setauthModalStatus({
          ...authContext.authModalStatus,
          otpSection: true,
        });
      }
    });
  };

  return (
    <main className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-6">
      <Toaster />
      {isLoading && <LoaderSpinner />}

      <MediumInfoText title="Create Account" className="uppercase mb-4 sm:mb-6" />

      <Formik
        initialValues={{
          userName: "",
          contact: "",
          address: "",
          email: "",
          password: "",
          role: "",
        }}
        validationSchema={SignUpSchema}
        onSubmit={createAccount}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-md">
            {/* Username */}
            <InputField
              iconname={User}
              inputName="userName"
              inputType="text"
              inputValue={values.userName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Username..."
              error={errors.userName}
              touched={touched.userName}
            />

            {/* Email */}
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

            {/* Contact */}
            <InputField
              iconname={Phone}
              inputName="contact"
              inputType="text"
              inputValue={values.contact}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Contact..."
              error={errors.contact}
              touched={touched.contact}
            />

            {/* Address */}
            <div>
              <div className="flex rounded-lg p-4 bg-input-bg justify-between items-center">
                <Navigation className="h-5 w-5 text-gray-400" />
                <select
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-input-bg w-full outline-none"
                >
                  <option value="">Select an address</option>
                  {AreaData.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              {touched.address && errors.address && (
                <p className="text-love text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <div className="flex rounded-lg p-4 bg-input-bg justify-between">
                <select
                  name="role"
                  value={values.role}
                  className="bg-input-bg w-full outline-none"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select a role</option>
                  <option value="owner">{role.OWNER}</option>
                  <option value="student">{role.TENANT}</option>
                </select>
              </div>
              {touched.role && errors.role && (
                <p className="text-love text-sm mt-1">{errors.role}</p>
              )}
            </div>

            {/* Password */}
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

            {/* Submit button full width */}
            <Button className="col-span-1 sm:col-span-2 w-full mt-2" type="submit">
              Sign Up
            </Button>
          </Form>
        )}
      </Formik>

      {/* Divider */}
      <hr className="bg-[#ADADAD] w-full max-w-2xl bg-opacity-50 my-6" />

      {/* Already have account? */}
      <div className="flex flex-wrap justify-center items-center gap-2 text-center">
        <InfoText title="Already Have An Account ?" />
        <InfoText
          title="Sign In"
          className="hover:animate-glow cursor-pointer"
          onClick={() =>
            authContext?.setauthModalStatus({
              ...authContext.authModalStatus,
              haveAccount: true,
              otpSection: false,
            })
          }
        />
      </div>
    </main>
  );
});
