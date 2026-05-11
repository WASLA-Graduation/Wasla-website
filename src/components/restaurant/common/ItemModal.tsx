/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAddItemMenu from "../../../hooks/restaurant/useAddItemMenu";
import useEditItemMenu from "../../../hooks/restaurant/useEditItemMenu";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const itemValidationSchema = (t: (key: string) => string) => Yup.object({
  nameEn: Yup.string()
    .required(t("validation.required"))
    .min(2, t("validation.minLength")),
  nameAr: Yup.string()
    .required(t("validation.required"))
    .min(2, t("validation.minLength")),
  price: Yup.number()
    .required(t("validation.required"))
    .positive(t("validation.positive"))
    .min(0.5, t("validation.minPrice")),
  discountPrice: Yup.number()
    .min(0, t("validation.positive"))
    .max(Yup.ref('price'), t("validation.discountLessThanPrice"))
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value),
  preparationTime: Yup.number()
    .required(t("validation.required"))
    .min(1, t("validation.minTime"))
    .max(180, t("validation.maxTime")),
  categoryId: Yup.string()
    .required(t("validation.required")),
  isAvailable: Yup.boolean(),
});

// Type for form values
interface FormValues {
  nameEn: string;
  nameAr: string;
  price: string;
  discountPrice: string;
  preparationTime: string;
  categoryId: string;
  isAvailable: boolean;
}

export default function ItemModal({ open, onClose, restaurantId, categories, initialData }: any) {
  const { t } = useTranslation();
  const { mutate: addItem, isPending: isAdding } = useAddItemMenu();
  const { mutate: editItem, isPending: isEditing } = useEditItemMenu();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [touchedFields, setTouchedFields] = useState<Record<keyof FormValues, boolean>>({
    nameEn: false,
    nameAr: false,
    price: false,
    discountPrice: false,
    preparationTime: false,
    categoryId: false,
    isAvailable: false,
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      nameEn: "",
      nameAr: "",
      price: "",
      discountPrice: "",
      preparationTime: "",
      categoryId: "",
      isAvailable: true,
    },
    validationSchema: itemValidationSchema(t),
    onSubmit: (values, { resetForm }) => {
      // Validate image for new items
      if (!initialData && !imageFile) {
        toast.error(t("validation.imageRequired"));
        return;
      }

      const formData = new FormData();
      formData.append("name.English", values.nameEn);
      formData.append("name.Arabic", values.nameAr);
      formData.append("price", values.price);
      formData.append("discountPrice", values.discountPrice || "0");
      formData.append("preparationTime", values.preparationTime);
      formData.append("restaurantId", restaurantId);
      formData.append("categoryId", values.categoryId);
      formData.append("isAvailable", String(values.isAvailable));
      
      if (imageFile) formData.append("imageUrl", imageFile);

      if (initialData) {
        editItem(
          { formData, id: initialData.id },
          {
            onSuccess: () => {
              resetForm();
              setImageFile(null);
              setImagePreview("");
              onClose();
            },
            onError: (error: any) => {
              console.error("Edit error:", error);
              toast.error(t("validation.editError"));
            },
          }
        );
      } else {
        addItem(formData, {
          onSuccess: () => {
            resetForm();
            setImageFile(null);
            setImagePreview("");
            onClose();
          },
          onError: (error: any) => {
            console.error("Add error:", error);
            toast.error(t("validation.addError"));
          },
        });
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        formik.setValues({
          nameEn: initialData.name?.english || initialData.nameValue || "",
          nameAr: initialData.name?.arabic || "",
          price: initialData.price?.toString() || "",
          discountPrice: initialData.discountPrice?.toString() || "",
          preparationTime: initialData.preparationTime?.toString() || "",
          categoryId: initialData.categoryId?.toString() || "",
          isAvailable: initialData.isAvailable ?? true,
        });
        setImagePreview(initialData.imageUrl || "");
        setImageFile(null);
      } else {
        formik.resetForm();
        setImagePreview("");
        setImageFile(null);
      }
      setTouchedFields({
        nameEn: false,
        nameAr: false,
        price: false,
        discountPrice: false,
        preparationTime: false,
        categoryId: false,
        isAvailable: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData]);

  const showError = (fieldName: keyof FormValues): string | false => {
    return touchedFields[fieldName] && formik.errors[fieldName] 
      ? formik.errors[fieldName] as string 
      : false;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
    style={{marginTop : "0"}}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-background border border-border rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? t("restaurant.menu.edit_item") : t("restaurant.menu.add_item")}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* English Name */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {t("restaurant.menu.name_en")} <span className="text-red-500">*</span>
              </label>
              <input
                name="nameEn"
                placeholder={t("restaurant.menu.name_en")}
                onChange={formik.handleChange}
                onBlur={() => setTouchedFields({ ...touchedFields, nameEn: true })}
                value={formik.values.nameEn}
                className={`input w-full ${showError("nameEn") ? "border-red-500" : ""}`}
              />
              {showError("nameEn") && (
                <p className="text-red-500 text-xs mt-1">{showError("nameEn")}</p>
              )}
            </div>

            {/* Arabic Name */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {t("restaurant.menu.name_ar")} <span className="text-red-500">*</span>
              </label>
              <input
                name="nameAr"
                placeholder={t("restaurant.menu.name_ar")}
                onChange={formik.handleChange}
                onBlur={() => setTouchedFields({ ...touchedFields, nameAr: true })}
                value={formik.values.nameAr}
                className={`input w-full ${showError("nameAr") ? "border-red-500" : ""}`}
              />
              {showError("nameAr") && (
                <p className="text-red-500 text-xs mt-1">{showError("nameAr")}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {t("restaurant.menu.category")} <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                onChange={formik.handleChange}
                onBlur={() => setTouchedFields({ ...touchedFields, categoryId: true })}
                value={formik.values.categoryId}
                className={`input w-full ${showError("categoryId") ? "border-red-500" : ""}`}
              >
                <option value="">{t("restaurant.menu.select_category")}</option>
                {categories?.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name?.english || c.nameValue}
                  </option>
                ))}
              </select>
              {showError("categoryId") && (
                <p className="text-red-500 text-xs mt-1">{showError("categoryId")}</p>
              )}
            </div>

            {/* Preparation Time */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                {t("restaurant.menu.preparation_time")} <span className="text-red-500">*</span>
              </label>
              <input
                name="preparationTime"
                type="number"
                placeholder={t("restaurant.menu.preparation_time")}
                onChange={formik.handleChange}
                onBlur={() => setTouchedFields({ ...touchedFields, preparationTime: true })}
                value={formik.values.preparationTime}
                className={`input w-full ${showError("preparationTime") ? "border-red-500" : ""}`}
              />
              {showError("preparationTime") && (
                <p className="text-red-500 text-xs mt-1">{showError("preparationTime")}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                step="0.5"
                placeholder="Price"
                onChange={formik.handleChange}
                onBlur={() => setTouchedFields({ ...touchedFields, price: true })}
                value={formik.values.price}
                className={`input w-full ${showError("price") ? "border-red-500" : ""}`}
              />
              {showError("price") && (
                <p className="text-red-500 text-xs mt-1">{showError("price")}</p>
              )}
            </div>

            {/* Discount Price */}
            <div>
              <label className="block text-sm mb-1 font-medium">
                Discount Price 
                {formik.values.discountPrice && formik.values.price && Number(formik.values.price) > 0 && (
                  <span className="text-green-600 ml-2">
                    (-{Math.round((Number(formik.values.discountPrice) / Number(formik.values.price)) * 100)}%)
                  </span>
                )}
              </label>
              <input
                name="discountPrice"
                type="number"
                step="0.5"
                placeholder="Discount (optional)"
                onChange={formik.handleChange}
                onBlur={() => setTouchedFields({ ...touchedFields, discountPrice: true })}
                value={formik.values.discountPrice}
                className={`input w-full ${showError("discountPrice") ? "border-red-500" : ""}`}
              />
              {showError("discountPrice") && (
                <p className="text-red-500 text-xs mt-1">{showError("discountPrice")}</p>
              )}
            </div>
          </div>

          {/* Available Switch */}
          <div className="flex items-center gap-3">
            <span className="font-medium">{t("restaurant.menu.available")}</span>
            <button
              type="button"
              onClick={() => formik.setFieldValue("isAvailable", !formik.values.isAvailable)}
              className={`w-12 h-6 rounded-full transition ${
                formik.values.isAvailable ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          </div>

          {/* Image Upload */}
          {imagePreview ? (
            <div className="relative h-40">
              <img src={imagePreview} loading="lazy" alt="Preview" className="w-full h-full object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => {
                  setImagePreview("");
                  setImageFile(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-border p-6 rounded-xl flex flex-col items-center cursor-pointer hover:bg-primary/5 transition">
              <FiUploadCloud size={30} />
              <span className="text-sm mt-2">
                {initialData ? t("restaurant.menu.change_image") : t("restaurant.menu.upload_image")}
              </span>
              <span className="text-xs text-dried mt-1">PNG, JPG, WEBP (Max 5MB)</span>
              <input 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error(t("validation.imageTooLarge"));
                      return;
                    }
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded-lg border border-border hover:bg-background/60 transition"
            >
              {t("restaurant.menu.cancel")}
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition disabled:opacity-50"
              disabled={isAdding || isEditing || !formik.isValid}
            >
              {isAdding || isEditing ? t("restaurant.menu.saving") : t("restaurant.menu.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}