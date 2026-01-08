import toast, { Toaster } from "react-hot-toast";
import { InfoText, InputField, LoaderSpinner } from "../../units";
import { Mail, Phone, User, Lock } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { updateCredentials, user } from "../../state-management/local/auth";
import { useUpdateUserMutation } from "../../state-management/api/user-api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AreaData, errorTypes } from "../../constant";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const ProfileSchema = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  contact: Yup.string()
    .matches(
      /^(97|98)\d{8}$/,
      "Enter a valid Nepali number (10 digits, starting with 97 or 98)"
    )
    .required("Contact is required"),
  address: Yup.string().required("Address is required"),
  role: Yup.string().required("Role is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must be at least 6 characters and include uppercase, lowercase, number, and special character"
    )
    .nullable(), // ✅ password optional unless editing
});

export const Profile = () => {
  const userDetails = useSelector(user);
  const dispatch = useDispatch();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

  const initialValues = {
    userName: userDetails?.userName ?? userDetails?.name ?? "",
    address: userDetails?.address ?? "",
    email: userDetails?.email ?? "",
    contact: userDetails?.contact ?? "",
    role: userDetails?.role ?? "",
    password: "", // NEW
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: any
  ) => {
    const payload: Record<string, any> = {
      userName: values.userName,
      address: values.address,
      email: values.email,
      contact: values.contact,
      role: values.role,
    };

    if (isPasswordEditable && values.password.trim()) {
      payload.password = values.password;
    }

    const userId = userDetails?.id;

    const resp = await updateUser({ id: userId, data: payload });

    if (resp.error) {
      const error = resp.error as FetchBaseQueryError;
      if ("data" in error) {
        toast.error((error.data as errorTypes).message as string);
      }
      if ("error" in error) {
        toast.error("Server timed out. Please Try Again Later!!!");
      }
    }

    if (resp.data) {
      toast.success("Successfully updated!!");
      dispatch(updateCredentials({ ...payload, id: userId }));

      resetForm({ values: { ...values, password: "" } });
      setIsPasswordEditable(false);
    }
  };

  return (
    <main className="flex flex-col gap-8">
      <Toaster />
      {isLoading ? (
        <LoaderSpinner />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={ProfileSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleChange, handleBlur, values, resetForm }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 p-4 md:p-6">
              {/* username */}
              <div className="flex flex-col gap-2">
                <InfoText title="Username" />
                <InputField
                  iconname={User}
                  inputType="text"
                  inputName="userName"
                  inputValue={values.userName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="userName"
                  component="p"
                  className="text-sm text-love"
                />
              </div>

              {/* email */}
              <div className="flex flex-col gap-2">
                <InfoText title="Mail" />
                <InputField
                  iconname={Mail}
                  inputType="text"
                  inputName="email"
                  inputValue={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-sm text-love"
                />
              </div>

              {/* contact */}
              <div className="flex flex-col gap-2">
                <InfoText title="Contact" />
                <InputField
                  iconname={Phone}
                  inputType="text"
                  inputName="contact"
                  inputValue={values.contact}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="contact"
                  component="p"
                  className="text-sm text-love"
                />
              </div>

              {/* address */}
              <div className="flex flex-col gap-2">
                <InfoText title="Address" />
                <div className="rounded-lg p-3 md:p-4 bg-input-bg flex items-center gap-2">
                  <Field
                    as="select"
                    name="address"
                    className="bg-input-bg w-full outline-none text-sm md:text-base"
                  >
                    <option value="">Select an Address</option>
                    {AreaData.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </Field>
                </div>
                <ErrorMessage
                  name="address"
                  component="p"
                  className="text-sm text-love"
                />
              </div>

              {/* role */}
              <div className="flex flex-col gap-2">
                <InfoText title="Role" />
                <Field
                  as="select"
                  name="role"
                  className="rounded-lg p-3 md:p-4 bg-input-bg justify-between text-sm md:text-base w-full"
                >
                  <option value="">Select Role</option>
                  <option value="owner">owner</option>
                  <option value="tenant">tenant</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="p"
                  className="text-sm text-love"
                />
              </div>

              {/* password */}
              <div className="flex flex-col gap-2">
                <InfoText title="Password" />
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <InputField
                      iconname={Lock}
                      inputType="password"
                      inputName="password"
                      inputValue={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!isPasswordEditable}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPasswordEditable(!isPasswordEditable)}
                    className={`rounded-full transition-colors p-2 ${
                      isPasswordEditable
                        ? "text-love" // cancel mode
                        : "text-brand" // edit mode
                    }`}
                  >
                    {isPasswordEditable ? (
                      // Cancel Icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 8 8"
                        className="pointer-events-none"
                      >
                        <path
                          fill="currentColor"
                          d="M4 4c0-2 3-2 3 0S4 6 4 4m1.5 2c3 0 3-4 0-4h-3c-3 0-3 4 0 4"
                        />
                      </svg>
                    ) : (
                      // Edit Icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 8 8"
                        className="pointer-events-none"
                      >
                        <path
                          fill="currentColor"
                          d="M1 4c0-2 3-2 3 0S1 6 1 4m4.5 2c3 0 3-4 0-4h-3c-3 0-3 4 0 4"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {isPasswordEditable && (
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-sm text-love"
                  />
                )}
              </div>

              {/* save/reset */}
              <section className="col-span-1 md:col-span-2">
                <div className="flex gap-4 flex-col sm:flex-row">
                  <button
                    type="submit"
                    className="rounded-md bg-brand px-4 py-3 sm:px-3 sm:py-2 text-sm text-other-white-100 font-semibold hover:animate-glow flex-1 sm:flex-none"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="text-sm bg-love px-4 py-3 sm:px-3 sm:py-2 rounded-md text-other-white-100 font-semibold hover:animate-glow flex-1 sm:flex-none"
                    onClick={() => {
                      resetForm();
                      setIsPasswordEditable(false);
                    }}
                  >
                    Reset
                  </button>
                </div>
              </section>
            </Form>
          )}
        </Formik>
      )}
    </main>
  );
};