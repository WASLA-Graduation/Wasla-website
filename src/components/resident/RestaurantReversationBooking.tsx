import useGetReversationForResident from "../../hooks/restaurant/useGetReversationForResident";
import useChangeReversationStatus from "../../hooks/restaurant/useChangeReversationStatus";
import { reversationData } from "../../types/restaurant/restaurant-types";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { FaCalendarAlt, FaPhone, FaUsers } from "react-icons/fa";
import ConfirmationModal from "../doctor/modals/ConfirmationModel";
import noData from "../../assets/images/nodata.webp";
import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import { RestaurantBookStatus } from "../../utils/enum";

export default function RestaurantBookings() {
  const id = sessionStorage.getItem("user_id")!;
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetReversationForResident(page, 10, id);
  const { mutate: changeStatus, isPending } = useChangeReversationStatus();

  const bookings = data?.data || [];

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(i18next.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(+hour);
    date.setMinutes(+minute);

    return date.toLocaleTimeString(i18next.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancel = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmCancel = () => {
    if (!selectedId) return;

    changeStatus({
      reversationId: selectedId,
      status: RestaurantBookStatus.Cancelled,
    });

    setShowConfirm(false);
    setSelectedId(null);
  };

  if (isLoading) return <DoctorCardSkeleton />;

  if (!bookings.length)
    return (
      <div className="flex flex-col items-center mt-20 gap-4">
        <img src={noData} className="w-48 opacity-70" />
        <p className="text-gray-400">{t("restaurant.noBookings")}</p>
      </div>
    );

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {bookings.map((b: reversationData) => (
          <motion.div
            key={b.id}
            whileHover={{ scale: 1.03, y: -3 }}
            className="flex flex-col sm:flex-row p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg">
            {/* Image */}
            <img
              src={b.restaurantProfile}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary"
            />

            <div className="flex-1 ml-6 flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    {b.restaurantName}
                  </h3>

                  <p className="text-dried flex items-center gap-2">
                    <FaPhone />
                    {b.restaurantPhone}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    b.status === RestaurantBookStatus.Pending
                      ? "bg-yellow-100 text-yellow-800"
                      : b.status === RestaurantBookStatus.Accepted
                        ? "bg-blue-100 text-blue-800"
                        : b.status === RestaurantBookStatus.Completed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                  }`}>
                  {b.status === RestaurantBookStatus.Pending
                    ? t("restaurant.pending")
                    : b.status === RestaurantBookStatus.Accepted
                      ? t("restaurant.accepted")
                      : b.status === RestaurantBookStatus.Completed
                        ? t("restaurant.completed")
                        : t("restaurant.cancelled")}
                </span>
              </div>

              {/* Info */}
              <div className="mt-3 space-y-1 text-dried">
                <p>
                  <FaCalendarAlt className="inline mr-2 text-blue-400" />
                  {formatDate(b.reservationDate)} -{" "}
                  {formatTime(b.reservationTime)}
                </p>

                <p>
                  <FaUsers className="inline mr-2 text-purple-400" />
                  {b.numberOfPersons} {t("restaurant.persons")}
                </p>
              </div>

              {/* Actions */}
              {b.status === RestaurantBookStatus.Pending && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleCancel(b.id)}
                    disabled={isPending}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                    {t("restaurant.cancel")}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-2 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
          {t("restaurant.prev")}
        </button>

        <span className="px-3">
          {t("restaurant.page")} {page}
        </span>

        <button
          disabled={data && page >= Math.ceil(data.totalCount / data.pageSize)}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
          {t("restaurant.next")}
        </button>
      </div>

      {/* Confirm Modal */}
      <ConfirmationModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmCancel}
      />
    </>
  );
}
