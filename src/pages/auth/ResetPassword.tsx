import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useResetPass from "../../hooks/auth/useResetPass";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const verificationCode = location.state?.verificationCode;
  const { t } = useTranslation();

  const { mutateAsync: resetpass, isPending } = useResetPass();

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/,
        t("login.passregex")
      )
      .required(t("login.Password is required")),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], t("login.passwordsMustMatch"))
      .required(t("login.Confirm password is required")),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const payload = { email, newPassword: values.newPassword , otp: verificationCode};
      await resetpass(payload, {
        onSuccess: () => {
          navigate("/auth/login");
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
      animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        {t("login.Reset Password")}
      </h2>
      <p className="text-sm text-muted mb-10">
        {t("login.resetFor")} <span className="font-semibold">{email}</span>
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div>
              <Field
                name="newPassword"
                type="password"
                placeholder={t("login.New Password")}
                className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <Field
                name="confirmPassword"
                type="password"
                placeholder={t("login.Confirm New Password")}
                className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all">
              {isPending ? t("login.Resetting...") : t("login.Reset Password")}
            </button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
