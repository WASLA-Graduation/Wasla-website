import useGetReversationForDashboard from "../../hooks/restaurant/useGetReversationForDashboard";
import useChangeReversationStatus from "../../hooks/restaurant/useChangeReversationStatus";
import { reversationDashboardData } from "../../types/restaurant/restaurant-types";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import {
  FaPhone,
  FaUsers,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa";

import ConfirmationModal from "../doctor/modals/ConfirmationModel";
import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import noData from "../../assets/images/nodata.webp";
import { RestaurantBookStatus } from "../../utils/enum";

export default function RestaurantReservationsDashboard() {
  const id = sessionStorage.getItem("user_id")!;
  const { t } = useTranslation();

  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetReversationForDashboard(page, 6, id);
  const { mutate: changeStatus, isPending } = useChangeReversationStatus();

  const bookings = data?.data || [];
  const totalPages = Math.ceil((data?.totalCount || 0) / 6);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"accept" | "cancel" | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(i18next.language);

  const formatTime = (time: string) => time.slice(0, 5);

  const handleAction = (id: number, type: "accept" | "cancel") => {
    setSelectedId(id);
    setActionType(type);
    setShowConfirm(true);
  };

  const confirmAction = () => {
    if (!selectedId || !actionType) return;

    changeStatus({
      reversationId: selectedId,
      status:
        actionType === "accept"
          ? RestaurantBookStatus.Accepted
          : RestaurantBookStatus.Cancelled,
    });

    setShowConfirm(false);
    setSelectedId(null);
    setActionType(null);
  };

  if (isLoading) return <DoctorCardSkeleton />;

  if (!bookings.length)
    return (
      <div className="flex flex-col items-center mt-20 gap-4 px-4 text-center">
        <img src={noData} className="w-40 sm:w-48 opacity-70" />
        <p className="text-gray-400 text-sm sm:text-base">
          {t("restaurant.noBookings")}
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 pb-10">

      {/* TITLE */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8 mr-2 ml-2"
      >
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-primary">
          <FaClipboardList />
          {t("restaurant.reservationsDashboard")}
        </h1>

        <p className="text-gray-500 text-sm sm:text-base mt-1">
          {t("restaurant.manageBookings")}
        </p>
      </motion.div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

        {bookings.map((b: reversationDashboardData) => (
          <motion.div
            key={b.id}
            whileHover={{ scale: 1.01 }}
            className="p-4 sm:p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col md:flex-row gap-3 sm:gap-4"
          >

            {/* IMAGE */}
            <img
              src={b.profile}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-primary mx-auto sm:mx-0"
            />

            <div className="flex-1 flex flex-col justify-between gap-3">

              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">

                <div className="text-center sm:text-left">
                  <p className="font-semibold text-primary text-sm sm:text-base">
                    {b.phone}
                  </p>

                  <p className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-500">
                    <FaPhone /> {b.phone}
                  </p>
                </div>

                {/* STATUS */}
                <span
                  className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold self-center sm:self-start ${
                    b.status === RestaurantBookStatus.Pending
                      ? "bg-yellow-100 text-yellow-800"
                      : b.status === RestaurantBookStatus.Accepted
                      ? "bg-blue-100 text-blue-800"
                      : b.status === RestaurantBookStatus.Completed
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {b.status === RestaurantBookStatus.Pending
                    ? t("restaurant.pending")
                    : b.status === RestaurantBookStatus.Accepted
                    ? t("restaurant.accepted")
                    : b.status === RestaurantBookStatus.Completed
                    ? t("restaurant.completed")
                    : t("restaurant.cancelled")}
                </span>
              </div>

              {/* INFO */}
              <div className="space-y-1 text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                <p className="flex items-center justify-center sm:justify-start gap-2">
                  <FaCalendarAlt />
                  {formatDate(b.reservationDate)} - {formatTime(b.reservationTime)}
                </p>

                <p className="flex items-center justify-center sm:justify-start gap-2">
                  <FaUsers />
                  {b.numberOfPersons} {t("restaurant.persons")}
                </p>
              </div>

              {/* ACTIONS */}
              {b.status === RestaurantBookStatus.Pending && (
                <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">

                  <button
                    onClick={() => handleAction(b.id, "accept")}
                    disabled={isPending}
                    className="w-full sm:w-auto px-3 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <FaCheck /> {t("restaurant.accept")}
                  </button>

                  <button
                    onClick={() => handleAction(b.id, "cancel")}
                    disabled={isPending}
                    className="w-full sm:w-auto px-3 py-2 bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <FaTimes /> {t("restaurant.cancel")}
                  </button>

                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded text-sm transition ${
                page === i + 1
                  ? "bg-primary text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* CONFIRM */}
      <ConfirmationModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmAction}
        type={actionType || "cancel"}
      />
    </div>
  );
}