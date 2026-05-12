import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useResendCode from "../../hooks/auth/useResendCode";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const initialValues = { email: "" };
  const {mutateAsync: resend , isPending} = useResendCode();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("login.Invalid email"))
      .required(t("login.Email is required")),
  });

  const handleSubmit = async (values: { email: string }) => {
  try {
    const payload = { email: values.email , verificationType : 1};
    await resend(payload, {
      onSuccess: () => {
        navigate("/auth/verify-otp", { state: { email: values.email } });
      },
    });
  } catch (error) {
    console.error(error);
  }
};

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-10 text-foreground">
        {t("login.forgot")}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                {t("login.Email")}
              </label>
              <Field
                name="email"
                type="email"
                placeholder={t("login.enter")}
                className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              {isPending ? t("login.Sending...") : t("login.Send OTP")}
            </button>

            <p
              onClick={() => navigate("/auth/login")}
              className="text-center text-sm text-primary cursor-pointer hover:underline"
            >
              {t("login.back")}
            </p>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
