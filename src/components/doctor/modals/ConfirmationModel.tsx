import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  type?: "accept" | "reject" | "cancel" | null;
}

export default function ConfirmationModal({
  show,
  onClose,
  onConfirm,
  title,
  message,
  type = "cancel",
}: ConfirmationModalProps) {
  const { t } = useTranslation();

  const getButtonColor = () => {
    if (type === "accept") return "bg-green-600 hover:bg-green-700";
    if (type === "reject") return "bg-yellow-500 hover:bg-yellow-600";
    return "bg-red-600 hover:bg-red-700";
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-background rounded-xl p-6 w-[90%] max-w-md text-center shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <h2 className="text-xl font-bold mb-4">
              {title || t(`tech.${type}Title`)}
            </h2>

            <p className="mb-6 text-dried">
              {message || t(`tech.${type}Message`)}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-dried hover:bg-gray-400 transition font-semibold"
              >
                {t("doctor.Cancel")}
              </button>

              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg text-white transition font-semibold ${getButtonColor()}`}
              >
                {t(`tech.${type}`)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

