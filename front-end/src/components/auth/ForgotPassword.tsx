import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "../../units";
import { Mail } from "react-feather";
import { Button } from "../../units";
import toast from "react-hot-toast";
import { useForgotPasswordMutation } from "../../state-management/api/auth-api";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (values: { email: string }) => {
    try {
      const data = await forgotPassword(values).unwrap();
      toast.success(data.msg);
    } catch (err: any) {
      toast.error(err?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-[50vh] bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 border border-gray-200 rounded-xl shadow-sm">
        <h2 className="text-lg sm:text-xl font-bold mb-6 text-center text-neutral-700">
          Forgot Password
        </h2>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form className="flex flex-col gap-4">
              <InputField
                iconname={Mail}
                inputName="email"
                inputType="text"
                inputValue={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                error={errors.email}
                touched={touched.email}
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
                <Button
                  type="button"
                  className="bg-slate-200 text-black text-sm py-2 px-4 rounded-md w-full sm:w-auto"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-md w-full sm:w-auto"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      
    </div>
  );
};
