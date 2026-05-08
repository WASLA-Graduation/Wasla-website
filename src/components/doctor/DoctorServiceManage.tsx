import { motion } from "framer-motion";
import { useState } from "react";
import useGetDoctorServices from "../../hooks/doctor/useGetDoctorService";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  doctorServiceData,
  doctorServiceEdit,
} from "../../types/doctor/doctorTypes";
import DeleteConfirmModal from "./modals/DeleteModal";
import AddServiceModal from "./modals/AddModal";
import UpdateServiceModal from "./modals/UpdateModal";
import { useTranslation } from "react-i18next";
import DoctorProfileSkeleton from "./DoctorProfileSkeleton";
import noData from "../../assets/images/nodata.webp";
import i18next from "i18next";

export default function DoctorServiceManage() {
  const doctorId = sessionStorage.getItem("user_id")!;
  const { data, isLoading } = useGetDoctorServices(doctorId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] =
    useState<doctorServiceEdit | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingService, setDeletingService] =
    useState<doctorServiceData | null>(null);
  const { t } = useTranslation();

  // Map doctorServiceData -> doctorServiceedit
  const mapDataToAdd = (service: doctorServiceData): doctorServiceEdit => ({
    serviceName: {
      english: service.serviceNameEnglish,
      arabic: service.serviceNameArabic,
    },
    description: {
      english: service.descriptionEnglish || "",
      arabic: service.descriptionArabic || "",
    },
    price: service.price,
    serviceDays: service.serviceDays,
    timeSlots: service.timeSlots,
    serviceId: service.id,
  });
  return (
    <div className="p-6">
      <motion.h1
        className="text-4xl font-bold text-center md:text-left text-foreground mt-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}>
        {t("doctor.manTit")}
      </motion.h1>

      <div
        className="
          flex 
          flex-col md:flex-row 
          items-center md:items-start 
          gap-3 md:gap-0 
          mt-2 mb-6
          justify-center md:justify-between
        "
        style={{ direction: "ltr" }}>
        <motion.p
          className="text-muted-foreground text-center md:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}>
          {t("doctor.manage")}
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            flex items-center gap-2 
            bg-primary text-white 
            px-4 py-2 rounded-lg shadow 
            hover:bg-primary/90
          "
          onClick={() => {
            setEditingService(null);
            setIsModalOpen(true);
          }}>
          <FaPlus /> {t("doctor.addServ")}
        </motion.button>
      </div>

      {isLoading && <DoctorProfileSkeleton />}

      {!isLoading && data && data.length === 0 && (
        <div className="flex justify-center mt-10">
          <img src={noData} alt="no data found"
           loading="lazy"
           className="opacity-80" />
        </div>
      )}
      {!isLoading && data && data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto">
          <table className="w-full border-collapse border border-border shadow-sm">
            <thead>
              <tr className="bg-border text-primary">
                <th className="p-3 text-left">{t("doctor.ServiceName")}</th>
                <th className="p-3 text-left">{t("doctor.Price")}</th>
                <th className="p-3 text-left">
                  {t("doctor.Days")} & {t("doctor.TimeSlots")}
                </th>
                <th className="p-3 text-center">{t("doctor.Actions")}</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((service: doctorServiceData, i) => (
                <motion.tr
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b hover:bg-canceled transition">
                  <td className="p-3 font-medium">
                    {i18next.language === "en"
                      ? service.serviceNameEnglish
                      : service.serviceNameArabic}
                  </td>
                  <td className="p-3">
                    {service.price} {t("doctor.EGP")}
                  </td>

                  {/* Days & times */}
                  <td className="p-3">
                    <div className="flex flex-col">
                      {service.serviceDays.map((day) => (
                        <details
                          key={day.dayOfWeek}
                          className="mb-1 bg-primary/5 rounded p-2">
                          <summary className="cursor-pointer font-semibold text-primary">
                            {
                              [
                                t("doctor.Sat"),
                                t("doctor.Sun"),
                                t("doctor.Mon"),
                                t("doctor.Tue"),
                                t("doctor.Wed"),
                                t("doctor.Thu"),
                                t("doctor.Fri"),
                              ][day.dayOfWeek]
                            }
                          </summary>

                          <div className="mt-2 flex flex-wrap gap-1">
                            {day.timeSlots.map((ti) => (
                              <span
                                key={ti.id}
                                className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                {ti.start.slice(0, 5)} {t("doctor.to") + " "}  
                                { ti.end.slice(0, 5)}
                              </span>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-3 flex justify-center items-center gap-2">
                    <button
                      className="p-2 bg-primary text-white rounded hover:bg-primary/80 transition"
                      onClick={() => {
                        setEditingService(mapDataToAdd(service));
                        setIsModalOpen(true);
                      }}>
                      <FaEdit />
                    </button>

                    <button
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      onClick={() => {
                        setDeletingService(service);
                        setIsDeleteOpen(true);
                      }}>
                      <FaTrash />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Modals */}
      {isModalOpen && !editingService && (
        <AddServiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          doctorId={doctorId}
        />
      )}

      {isModalOpen && editingService && (
        <UpdateServiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingService}
          doctorId={doctorId}
        />
      )}
      {isDeleteOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          serviceId={deletingService?.id}
          serviceName={
            i18next.language === "en"
              ? deletingService?.serviceNameEnglish
              : deletingService?.serviceNameArabic
          }
        />
      )}
    </div>
  );
}
