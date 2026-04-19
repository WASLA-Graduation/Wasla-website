/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaLock, FaPhone, FaUtensils } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import useGetRestaurantProfile from "../../hooks/restaurant/useGetRestaurantProfile";
import useGetRestaurantSpecial from "../../hooks/restaurant/useGetRestaurantSpecial";

import noData from "../../assets/images/nodata.webp";
import GymProfileSkeleton from "../gym/GymProfileSkeleton";
import EditRestaurantProfileModal from "./Modal/EditRestaurantProfileModal";
import ChangePasswordModal from "../common/ChangePasswordModal";

export default function RestaurantProfile() {
  const id = sessionStorage.getItem("user_id")!;
  const { t } = useTranslation();

  const { data, isLoading } = useGetRestaurantProfile(id);
  const { data: categories } = useGetRestaurantSpecial();
  const [openPass, setOpenPass] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  if (isLoading) return <GymProfileSkeleton />;

  if (!data)
    return (
      <div className="flex justify-center mt-10">
        <img src={noData} className="w-64" />
      </div>
    );

  const categoryName =
    categories?.find((c) => c.id === data.restaurantCategoryId)?.name || "—";

  return (
    <div style={{ direction: "ltr" }}>
      <motion.h1 className="text-3xl font-bold mt-6 mb-2">
        {t("restaurant.profile")}
      </motion.h1>

      <motion.div className="max-w-6xl bg-background border rounded-xl shadow overflow-hidden">
        <div className="h-32 bg-primary/10"></div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center -mt-16">
            <img
              src={data.profile}
              className="w-32 h-32 rounded-xl object-cover border-4 border-background"
            />

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-primary">{data.name}</h2>

              <p className="flex items-center gap-2 text-muted-foreground mt-1 justify-center md:justify-start">
                <FaUtensils /> {categoryName}
              </p>

              <div className="flex gap-3 mt-4 justify-center md:justify-start">
                <button
                  onClick={() => setOpenEdit(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">
                  <FaEdit /> {t("restaurant.edit")}
                </button>

                <button
                  onClick={() => setOpenPass(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10">
                  <FaLock /> {t("gym.changePassword")}
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <ProfileItem title={t("restaurant.owner")} value={data.ownerName} />
            <ProfileItem title={t("restaurant.email")} value={data.email} />

            <div>
              <span className="text-sm text-muted-foreground">
                {t("restaurant.phone")}
              </span>
              <div className="flex items-center gap-2 mt-2 font-semibold">
                <FaPhone /> {data.phoneNumber}
              </div>
            </div>

            <ProfileItem
              title={t("restaurant.description")}
              value={data.description}
            />
          </div>

          {/* Gallery */}
          {data.gallery?.length > 0 && (
            <>
              <h3 className="text-xl font-bold mt-8 mb-4">
                {t("restaurant.gallery")}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.gallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setPreviewImage(img)}
                    className="w-full h-28 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>

      <ChangePasswordModal
        isOpen={openPass}
        onClose={() => setOpenPass(false)}
        email={data.email}
      />

      <EditRestaurantProfileModal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        data={data}
        categories={categories}
      />
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}>
          <img
            src={previewImage}
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

function ProfileItem({ title, value }: any) {
  return (
    <div>
      <span className="text-sm text-muted-foreground">{title}</span>
      <p className="text-lg font-semibold mt-1">{value || "—"}</p>
    </div>
  );
}
