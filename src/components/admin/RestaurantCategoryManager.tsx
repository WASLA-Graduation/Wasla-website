import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  FaCheck,
  FaEdit,
  FaPlus,
  FaTimes,
  FaTrash,
  FaUtensils,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

import useGetRestaurantSpecial from "../../hooks/restaurant/useGetRestaurantSpecial";
import useAddRestaurantCategory from "../../hooks/admin/useAddRestaurantCategory";
import useEditRestaurantCategory from "../../hooks/admin/useEditRestaurantCategory";
import useDeleteRestaurantCategory from "../../hooks/admin/useDeleteRestaurantCategory";

export default function RestaurantCategoryManager() {
  const { t } = useTranslation();

  const { data, isLoading } = useGetRestaurantSpecial();

  const addMutation = useAddRestaurantCategory();
  const editMutation = useEditRestaurantCategory();
  const deleteMutation = useDeleteRestaurantCategory();

  const [english, setEnglish] = useState("");
  const [arabic, setArabic] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const isDisabled = useMemo(() => {
    return (
      !english.trim() ||
      !arabic.trim() ||
      addMutation.isPending ||
      editMutation.isPending
    );
  }, [
    english,
    arabic,
    addMutation.isPending,
    editMutation.isPending,
  ]);

  const resetForm = () => {
    setEnglish("");
    setArabic("");
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (isDisabled) return;

    const payload = {
      name: {
        english,
        arabic,
      },
    };

    if (editingId) {
      editMutation.mutate(
        {
          id: editingId,
          ...payload,
        },
        {
          onSuccess: resetForm,
        },
      );
    } else {
      addMutation.mutate(payload, {
        onSuccess: resetForm,
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (item: any) => {
    setEditingId(item.id);

    // لو الـ API بيرجع string
    setEnglish(item.name);
    setArabic(item.name);
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl">
              <FaUtensils />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {t("admin.restaurantCategories")}
              </h2>

              <p className="text-sm text-muted-foreground">
                {t("admin.manageRestaurantCategories")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="text-sm font-medium mb-2 block">
            {t("admin.englishName")}
          </label>

          <input
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder={t("admin.enterEnglishName")}
            className="w-full h-12 rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            {t("admin.arabicName")}
          </label>

          <input
            type="text"
            value={arabic}
            onChange={(e) => setArabic(e.target.value)}
            placeholder={t("admin.enterArabicName")}
            className="w-full h-12 rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-end gap-3">
          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="h-12 flex-1 rounded-2xl bg-primary text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition">
            {editingId ? <FaCheck /> : <FaPlus />}

            {editingId
              ? t("admin.updateCategory")
              : t("admin.addCategory")}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center hover:bg-muted transition">
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      {isLoading ? (
        <div className="py-16 flex justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data?.length ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {data.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background to-muted/20 p-5 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl" />

              <div className="relative flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl">
                    <FaUtensils />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg capitalize">
                      {item.name}
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      {t("admin.restaurantCategory")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(item)}
                    className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center hover:scale-105 transition">
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:scale-105 transition">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-3xl">
            <FaUtensils />
          </div>

          <h3 className="text-lg font-semibold mb-2">
            {t("admin.noCategories")}
          </h3>

          <p className="text-muted-foreground">
            {t("admin.noCategoriesDesc")}
          </p>
        </div>
      )}
    </div>
  );
}