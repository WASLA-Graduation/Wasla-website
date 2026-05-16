import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useCheckout from "../../../../hooks/restaurant/cart/useCheckout";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoneyBillWave } from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  residentId: string;
  restaurantId: string;
}

export default function CheckoutModal({
  open,
  onClose,
  residentId,
  restaurantId,
}: Props) {
  const { t } = useTranslation();
  const { mutate: checkout, isPending } = useCheckout();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<number>(3);

  // reset on open
  useEffect(() => {
    if (open) {
      setAddress("");
      setNotes("");
      setPayment(3);
    }
  }, [open]);

  const handleCheckout = () => {
    if (!address.trim()) {
      toast.error(t("restaurant.addressRequired"));
      return;
    }

    checkout(
      {
        restaurantId,
        residentId,
        address,
        notes,
        paymentMethod: payment,
      },
      {
        onSuccess: (res) => {
          onClose();

          if (payment === 1 && res?.data) {
            window.location.href = res.data.paymentKey;
          }
          else{
            navigate("/resident/profile/my-bookings");
          }
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-[90] flex items-center justify-center p-4"
          style={{marginTop : "0"}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          
          {/* Modal */}
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="w-full sm:max-w-md bg-background rounded-t-2xl sm:rounded-2xl p-5 space-y-4 shadow-2xl"
          >
            
            <h2 className="text-lg font-bold text-primary text-center">
              {t("restaurant.checkout")}
            </h2>

            {/* Address */}
            <input
              type="text"
              placeholder={t("restaurant.address")}
              className="w-full border bg-background border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* Notes */}
            <textarea
              placeholder={t("restaurant.notes")}
              className="w-full border bg-background border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            {/* Payment */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                {t("restaurant.paymentMethod")}
              </p>

             <div className="flex gap-2">
  
  {/* Card */}
  <button
    onClick={() => setPayment(1)}
    className={`
      flex-1 flex items-center justify-center gap-2
      border rounded-lg py-2 transition-all duration-200
      text-sm font-medium
      ${
        payment === 1
          ? "bg-primary text-white border-primary shadow-md scale-[1.02]"
          : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
      }
    `}
  >
    <CiCreditCard1 className="text-lg" />
    {t("restaurant.card")}
  </button>

  {/* Cash */}
  <button
    onClick={() => setPayment(3)}
    className={`
      flex-1 flex items-center justify-center gap-2
      border rounded-lg py-2 transition-all duration-200
      text-sm font-medium
      ${
        payment === 3
          ? "bg-primary text-white border-primary shadow-md scale-[1.02]"
          : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
      }
    `}
  >
    <FaMoneyBillWave className="text-lg" />
    {t("restaurant.cash")}
  </button>

</div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 border border-border rounded-lg py-2 hover:bg-muted transition"
              >
                {t("common.cancel")}
              </button>

              <button
                onClick={handleCheckout}
                disabled={isPending}
                className="flex-1 bg-primary text-white rounded-lg py-2 disabled:opacity-50 hover:scale-[1.02] transition"
              >
                {isPending
                  ? t("restaurant.processing")
                  : t("restaurant.confirm2")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}