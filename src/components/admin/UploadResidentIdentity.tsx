import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FaCheckCircle, FaIdCard, FaSpinner, FaUpload } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useTranslation } from "react-i18next";

import useUploadIdentity from "../../hooks/admin/useUploadIdentity";

export default function UploadResidentIdentity() {
  const { t } = useTranslation();

  const [gmail, setGmail] = useState("");
  const [nationalI, setNationalI] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isValidEmail = emailRegex.test(gmail);
  const { mutate, isPending } = useUploadIdentity();
  const isDisabled = useMemo(() => {
    return (
      !gmail.trim() ||
      !nationalI.trim() ||
      !isValidEmail ||
      nationalI.length < 14 ||
      isPending
    );
  }, [gmail, nationalI, isValidEmail, isPending]);

  const handleSubmit = () => {
    if (isDisabled) return;

    mutate(
      {
        gmail,
        NationalI: nationalI,
      },
      {
        onSuccess: () => {
          setGmail("");
          setNationalI("");
        },
      },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-3xl p-5 md:p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl">
          <FaIdCard />
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-bold">
            {t("admin.uploadIdentity")}
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            {t("admin.uploadIdentityDesc")}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Email */}
        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <MdEmail className="text-primary" />
            {t("admin.email")}
          </label>

          <input
            type="email"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            placeholder={t("admin.enterEmail")}
            className={`w-full h-12 rounded-2xl border bg-background px-4 outline-none transition focus:ring-2
  ${
    gmail && !isValidEmail
      ? "border-red-500 focus:ring-red-500/20"
      : "border-border focus:border-primary focus:ring-primary/20"
  }`}
          />
          {gmail && !isValidEmail && (
            <p className="text-xs text-red-500 mt-2">
              {t("admin.invalidEmail")}
            </p>
          )}
        </div>

        {/* National ID */}
        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <FaIdCard className="text-primary" />
            {t("admin.nationalId")}
          </label>

          <input
            type="text"
            maxLength={14}
            value={nationalI}
            onChange={(e) => setNationalI(e.target.value.replace(/\D/g, ""))}
            placeholder={t("admin.enterNationalId")}
            className="w-full h-12 rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          {nationalI && nationalI.length < 14 && (
            <p className="text-xs text-red-500 mt-2">
              {t("admin.nationalIdValidation")}
            </p>
          )}
        </div>

        {/* Button */}
        <div className="flex items-end">
          <button
            disabled={isDisabled}
            onClick={handleSubmit}
            className="w-full h-12 rounded-2xl bg-primary text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {isPending ? <FaSpinner className="animate-spin" /> : <FaUpload />}

            {isPending ? t("admin.uploading") : t("admin.uploadIdentity")}
          </button>
        </div>
      </div>

      {/* Helper */}
      <div className="mt-5 rounded-2xl border border-primary/10 bg-primary/5 p-4 flex items-start gap-3">
        <FaCheckCircle className="text-primary mt-1" />

        <div>
          <p className="font-medium text-sm">
            {t("admin.identityHelperTitle")}
          </p>

          <p className="text-sm text-muted-foreground mt-1">
            {t("admin.identityHelperDesc")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
