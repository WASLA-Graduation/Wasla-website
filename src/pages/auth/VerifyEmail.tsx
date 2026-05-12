import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useVerifyEmail from "../../hooks/auth/useVerifyEmail";
import useResendCode from "../../hooks/auth/useResendCode";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const location = useLocation();
  const email = location.state?.email;
  const role = location.state?.role;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync: verifyEmail, isPending } = useVerifyEmail();
  const { mutateAsync: resendcode, isPending: isLoading } = useResendCode();

  const [timer, setTimer] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);

  const initialValues = {
    verificationCode: "",
  };

  const validationSchema = Yup.object({
    verificationCode: Yup.string()
      .length(4, t("login.otplen"))
      .required(t("login.OTP is required")),
  });

  const handleSubmit = async (values: { verificationCode: string }) => {
    try {
      const payload = { email, verificationCode: values.verificationCode , type:0};
      await verifyEmail(payload, {
        onSuccess: () => {
          toast.success("Verified Successfully");
          navigate("/auth/complete-profile", { state: { email, role } });
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleResend = async () => {
    if (isCooldown) return;

    try {
      const payload = { email , verificationType : 0 };
      await resendcode(payload);
      toast.success("Code resent successfully");
      setIsCooldown(true);
      setTimer(60);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isCooldown && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsCooldown(false);
    }
    return () => clearInterval(interval);
  }, [isCooldown, timer]);

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        {t("login.Verify OTP")}
      </h2>

      <p className="text-sm text-center text-muted mb-10">
        {t("login.please")} <span className="font-semibold">{email}</span>
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div>
              <Field
                name="verificationCode"
                type="text"
                placeholder={t("login.Enter OTP")}
                maxLength={6}
                className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-center tracking-widest text-lg bg-background text-foreground"
              />
              <ErrorMessage
                name="verificationCode"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              {isPending ? t("login.Verifying...") : t("login.Verify OTP")}
            </button>

            <p
              onClick={handleResend}
              className={`text-center text-sm cursor-pointer transition-all ${
                isCooldown || isLoading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary hover:underline"
              }`}
            >
              {isCooldown
                ? `${t("login.Resend available in")} ${timer}s`
                : !isLoading
                ? t("login.Resend Code")
                : t("login.Sending...")}
            </p>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
