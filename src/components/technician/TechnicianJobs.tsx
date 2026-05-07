import useGetTechAllBooking from "../../hooks/technican/useGetTechAllBookings";
import useAcceptTechBook from "../../hooks/technican/useAcceptTechBook";
import useRejectTechBook from "../../hooks/technican/useRejectTechBook";
import useCancelTechBook from "../../hooks/technican/useCancelTechBook";

import { TechnicianComingBookingData } from "../../types/technician/technician-types";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaPhone,
  FaUser,
} from "react-icons/fa";

import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import ConfirmationModal from "../doctor/modals/ConfirmationModel";
import noData from "../../assets/images/nodata.webp";
import { TechBookStatus } from "../../utils/enum";

export default function TechnicianJobs() {
  const techId = sessionStorage.getItem("user_id")!;
  const { t } = useTranslation();

  const { data: bookings, isLoading } = useGetTechAllBooking(techId);

  const { mutate: acceptBook, isPending: acceptLoading } = useAcceptTechBook();
  const { mutate: rejectBook, isPending: rejectLoading } = useRejectTechBook();
  const { mutate: cancelBook, isPending: cancelLoading } = useCancelTechBook();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<
    "accept" | "reject" | "cancel" | null
  >(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString(i18next.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAction = (id: number, type: "accept" | "reject" | "cancel") => {
    setSelectedId(id);
    setActionType(type);
    setShowConfirm(true);
  };

  const confirmAction = () => {
    if (!selectedId || !actionType) return;

    if (actionType === "accept") acceptBook(selectedId);
    if (actionType === "reject") rejectBook(selectedId);
    if (actionType === "cancel") cancelBook({ bookingId: selectedId, isResident: false });

    setShowConfirm(false);
    setSelectedId(null);
    setActionType(null);
  };

  if (isLoading) return <DoctorCardSkeleton />;

  if (!bookings || bookings.length === 0)
    return (
      <div className="flex flex-col items-center mt-20 gap-4">
        <img src={noData} loading="lazy" className="w-48 opacity-70" />
        <p className="text-gray-400">{t("tech.noBookings")}</p>
      </div>
    );

  return (
    <>
      <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            {t("tech.jobsTitle")}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{t("tech.jobsDesc")}</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {bookings.map((b: TechnicianComingBookingData) => (
          <motion.div
            key={b.bookingId}
            whileHover={{ scale: 1.02 }}
            className="p-4 sm:p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* User */}
              <div className="flex items-center gap-3 flex-1">
                <img
                  src={b.residentImage}
                  loading="lazy"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-primary"
                />

                <div>
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <FaUser /> {b.residentName}
                  </h3>

                  <p className="text-sm flex items-center gap-2 text-dried">
                    <FaPhone /> {b.residentPhone}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="self-start sm:self-auto">
                <span
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    b.status === TechBookStatus.Pending
                      ? "bg-yellow-100 text-yellow-800"
                      : b.status === TechBookStatus.Accepted
                        ? "bg-blue-100 text-blue-800"
                        : b.status === TechBookStatus.Done
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                  }`}>
                  {b.status === TechBookStatus.Pending
                    ? t("tech.pending")
                    : b.status === TechBookStatus.Accepted
                      ? t("tech.accepted")
                      : b.status === TechBookStatus.Done
                        ? t("tech.done")
                        : b.status === TechBookStatus.Rejected
                          ? t("tech.rejected")
                          : t("tech.cancelled")}
                </span>
              </div>
            </div>

            {/* INFO */}
            <div className="mt-4 space-y-2 text-dried text-sm">
              <p>
                <FaCalendarAlt className="inline mr-2 text-blue-400" />
                {formatDate(b.bookingDate)}
              </p>

              <p>
                <FaMoneyBillWave className="inline mr-2 text-green-400" />
                {b.price} {t("tech.egp")}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-5">
              {/* Pending */}
              {b.status === TechBookStatus.Pending && (
                <>
                  <button
                    onClick={() => handleAction(b.bookingId, "accept")}
                    disabled={acceptLoading}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    {t("tech.accept")}
                  </button>

                  <button
                    onClick={() => handleAction(b.bookingId, "reject")}
                    disabled={rejectLoading}
                    className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                    {t("tech.reject")}
                  </button>
                </>
              )}

              {/* Accepted */}
              {b.status === TechBookStatus.Accepted && (
                <button
                  onClick={() => handleAction(b.bookingId, "cancel")}
                  disabled={cancelLoading}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  {t("tech.cancel")}
                </button>
              )}

              {/* Done */}
              {b.status === TechBookStatus.Done && (
                <span className="text-green-500 font-semibold text-center sm:text-right">
                  ✔ {t("tech.completed")}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {/* Confirm Modal */}
      <ConfirmationModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmAction}
        type={actionType!}
      />
    </>
  );
}
