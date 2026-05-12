import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useVerifyEmail from "../../hooks/auth/useVerifyEmail";
import useResendCode from "../../hooks/auth/useResendCode";
import { useEffect, useState } from "react";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const { t } = useTranslation();

  const { mutateAsync: verifyotp, isPending } = useVerifyEmail();
  const { mutateAsync: resendcode, isPending: isLoading } = useResendCode();

  const [timer, setTimer] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);

  const initialValues = { verificationCode: "" };

  const validationSchema = Yup.object({
    verificationCode: Yup.string()
      .length(4, t("login.otplen"))
      .required(t("login.OTP is required")),
  });

  async function handleResend() {
    if (isCooldown) return;

    const payload = { email , verificationType: 1};
    await resendcode(payload);
    setTimer(60);
    setIsCooldown(true);
  }

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

 const handleSubmit = async (values: { verificationCode: string }) => {
  try {
    const payload = {
      email,
      verificationCode: values.verificationCode,
      type: 1,
    };

    await verifyotp(payload, {
      onSuccess: () => {
        navigate("/auth/reset-password", {
          state: {
            email,
            verificationCode: values.verificationCode,
          },
        });
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
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              {isPending ? t("login.Verifying...") : t("login.Verify OTP")}
            </button>

            <p
              onClick={!isCooldown ? handleResend : undefined}
              className={`text-center text-sm cursor-pointer transition-all ${
                isCooldown
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary hover:underline"
              }`}
            >
              {isCooldown
                ? `${t("login.Resend in")} ${formatTime(timer)}`
                : isLoading
                ? t("login.Sending...")
                : t("login.Resend Code")}
            </p>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
