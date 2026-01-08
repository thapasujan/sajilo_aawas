import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "../../units";
import { Lock } from "react-feather";
import { Button } from "../../units";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "../../state-management/api/auth-api";


const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must be at least 6 characters and include uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation();

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    try {
      const res = await resetPassword({ token, password: values.password }).unwrap();
      toast.success(res.msg);
      navigate("/");
    } catch (error: any) {
      toast.error(error?.data?.msg || "Invalid or expired link");
    }
  };

  return (
    <div className="flex items-center justify-center  h-[50vh] bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 border border-gray-200 rounded-xl shadow-sm">
        <h2 className="text-lg sm:text-xl font-bold mb-6 text-center text-slate-600">
          Reset Password
        </h2>
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form className="flex flex-col gap-4">
              <InputField
                iconname={Lock}
                inputName="password"
                inputType="password"
                inputValue={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="New Password"
                error={errors.password}
                touched={touched.password}
              />
              <InputField
                iconname={Lock}
                inputName="confirmPassword"
                inputType="password"
                inputValue={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm Password"
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
                <Button
                  type="button"
                  className="bg-slate-200 text-black text-sm py-2 px-4 rounded-md w-full sm:w-auto"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand hover:opacity-90 text-white text-sm py-2 px-4 rounded-md w-full sm:w-auto"
                >
                  Reset Password
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    
    </div>
  );
};
