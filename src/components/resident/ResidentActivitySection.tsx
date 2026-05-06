import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useGetUserActivity from "../../hooks/userEvent/useGetUserActivity";
import { FaStar } from "react-icons/fa";

interface Props {
  userId: string;
}

export default function ResidentActivitySection({ userId }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: activity, isLoading } = useGetUserActivity(userId);

  if (!isLoading && (!activity || activity.length === 0)) return null;

  return (
    <section className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center">
        {t("resident.recommend")}
      </motion.h2>

      {isLoading ? (
        <div className="text-center py-10 text-muted">
          {t("resident.loading")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
          {activity?.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition bg-background border border-border flex flex-col h-full">
              {/* Image */}
              <div className="h-40 overflow-hidden">
                <img
                  src={ item.image }
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-base line-clamp-1 mb-1">
                  {item.name}
                </h3>

                <p className="text-sm text-dried line-clamp-2 mb-3">
                  {item.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-500 mb-4">
                  <FaStar />
                  <span className="text-sm font-medium">
                    {item.rating.toFixed(1)}
                  </span>
                </div>

                {/* Button */}
                <button
                  onClick={() =>
                    item.roleName === "doctor" ?
                    navigate(`/resident/service/doctors/${item.id}`)
                    :
                    item.roleName === "gym" ?
                    navigate(`/resident/service/gyms/${item.id}`)
                    :
                    item.roleName === "technician" ?
                    navigate(`/resident/service/technicians/${item.id}`)
                    :
                    navigate(`/resident/service/restaurants/${item.id}`)
                  }
                  className="mt-auto w-full py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition">
                  {t("resident.viewProfile")}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
