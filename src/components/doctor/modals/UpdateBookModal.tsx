import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useUpdateDoctorBook from "../../../hooks/doctor/useUpdateDoctorBook";
import { doctorUpdateBookData } from "../../../types/doctor/doctorTypes";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface EditBookingModalProps {
  show: boolean;
  onClose: () => void;
  bookingId: number;
  currentDate: string;
  currentDayOfWeek: number;
  currentStart: string;
  currentEnd: string;
}

const parseDateFromString = (dateStr: string): Date | null => {
  if (!dateStr) return null;

  const iso = dateStr.replace(" ", "T");

  const date = new Date(iso);

  return isNaN(date.getTime()) ? null : date;
};

const getCustomDayOfWeek = (date: Date): number => {
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const jsDay = localDate.getDay();
  return (jsDay + 1) % 7;
};

export default function EditBookingModal({
  show,
  onClose,
  bookingId,
  currentDate,
  currentDayOfWeek,
  currentStart,
  currentEnd,
}: EditBookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    parseDateFromString(currentDate) || new Date(),
  );
  const [startTime, setStartTime] = useState(currentStart);
  const [endTime, setEndTime] = useState(currentEnd);
  const { t } = useTranslation();
  const { mutate: updateBook, isPending } = useUpdateDoctorBook();

  const formatTime = (time: string) => {
    return `${time}:00`;
  };

  const formatBookingDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}T00:00:00`;
};

  const handleConfirm = () => {
    if (!selectedDate) {
      toast.error(t("doctor.selectDate"));
      return;
    }

    const dayOfWeek = getCustomDayOfWeek(selectedDate);
    const currentDateObj = parseDateFromString(currentDate);

    if (
      currentDateObj &&
      dayOfWeek === currentDayOfWeek &&
      selectedDate.toDateString() === currentDateObj.toDateString()
    ) {
      toast.error(t("doctor.should"));
      return;
    }

    const payload: doctorUpdateBookData = {
      bookingId,
      newDayOfWeek: dayOfWeek,
      bookingDate: formatBookingDate(selectedDate),
      newStart: formatTime(startTime),
      newEnd: formatTime(endTime),
    };

    updateBook(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ marginTop: "0" }}>
          <motion.div
            className="bg-background rounded-xl p-6 w-[90%] max-w-md text-center shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            <h2 className="text-xl text-foreground font-bold mb-4">
              {t("doctor.editBooking")}
            </h2>
            <div className="mb-4 flex flex-col gap-3 text-sm">
              <div>
                <label className="font-semibold mb-1 block">
                  {t("doctor.newDate")}
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="bg-background border px-3 py-2 rounded w-full"
                  minDate={new Date()}
                />
              </div>
              <div>
                <label className="font-semibold mb-1 block">
                  {t("doctor.start")}
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-background border px-3 py-2 rounded w-full"
                />
              </div>
              <div>
                <label className="font-semibold mb-1 block">
                  {t("doctor.end")}
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-background border px-3 py-2 rounded w-full"
                />
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-white bg-dried hover:bg-gray-400 transition font-semibold">
                {t("doctor.Cancel")}
              </button>
              <button
                disabled={isPending}
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-semibold">
                {isPending ? t("profile.Saving...") : t("doctor.conf")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
