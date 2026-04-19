import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaCalendarAlt } from "react-icons/fa";

import DoctorBookings from "../../components/resident/DoctorBookings";
import GymBookings from "../../components/resident/GymBookings";
import TechBookings from "../../components/resident/TechniciansBooking";
import RestaurantBookings from "../../components/resident/RestaurantReversationBooking";

type BookingType = "doctor" | "gym" | "technician" | "resRev";

export default function ResidentMyBooking() {
  const { t } = useTranslation();
  const [bookingType, setBookingType] = useState<BookingType>("doctor");

  const tabs = [
    { key: "doctor", label: t("resident.doctors") },
    { key: "gym", label: t("resident.gymsb") },
    { key: "technician", label: t("resident.techsb") },
    { key: "resRev", label: t("resident.resRev") },
  ];

  return (
    <div className="w-full bg-background pb-16 px-3 sm:px-6 text-foreground">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl sm:text-2xl md:text-3xl font-bold mt-4 mb-5 flex items-center"
      >
        <FaCalendarAlt className="inline text-blue-500 mr-2" />
        {t("resident.myBooking")}
      </motion.h2>

      {/* Tabs */}
    <div className="grid grid-cols-2 sm:flex gap-2 mb-6">
  {tabs.map((tab) => (
    <button
      key={tab.key}
      onClick={() => setBookingType(tab.key as BookingType)}
      className={`w-full sm:w-auto text-center px-3 py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
        bookingType === tab.key
          ? "bg-primary text-white"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>

      {/* Content */}
      <div className="w-full">
        {bookingType === "doctor" && <DoctorBookings />}
        {bookingType === "gym" && <GymBookings />}
        {bookingType === "technician" && <TechBookings />}
        {bookingType === "resRev" && <RestaurantBookings />}
      </div>
    </div>
  );
}