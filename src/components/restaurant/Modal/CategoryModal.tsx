/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAddCategoryMenu from "../../../hooks/restaurant/useAddCategoryMenu";
import useEditCategoryMenu from "../../../hooks/restaurant/useEditCategoryMenu";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// Validation Schema for Category
const categoryValidationSchema = (t: (key: string) => string) => Yup.object({
  nameEn: Yup.string()
    .required(t("validation.required"))
    .min(2, t("validation.minLength"))
    .max(50, t("validation.maxLength")),
  nameAr: Yup.string()
    .required(t("validation.required"))
    .min(2, t("validation.minLength"))
    .max(50, t("validation.maxLength")),
});

// Type for form values
interface CategoryFormValues {
  nameEn: string;
  nameAr: string;
}

export default function CategoryModal({
  open,
  onClose,
  restaurantId,
  initialData,
}: any) {
  const { t } = useTranslation();

  const { mutate: addCategory, isPending: isAdding } = useAddCategoryMenu();
  const { mutate: editCategory, isPending: isEditing } = useEditCategoryMenu();

  const [touchedFields, setTouchedFields] = useState<Record<keyof CategoryFormValues, boolean>>({
    nameEn: false,
    nameAr: false,
  });

  const formik = useFormik<CategoryFormValues>({
    initialValues: {
      nameEn: "",
      nameAr: "",
    },
    validationSchema: categoryValidationSchema(t),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        name: {
          english: values.nameEn,
          arabic: values.nameAr,
        },
        restaurantId,
      };

      if (initialData) {
        editCategory(
          { ...payload, id: initialData.id },
          {
            onSuccess: () => {
              resetForm();
              setTouchedFields({ nameEn: false, nameAr: false });
              onClose();
            },
            onError: (error: any) => {
              console.error("Edit error:", error);
              toast.error(t("validation.editError"));
            },
          }
        );
      } else {
        addCategory(payload, {
          onSuccess: () => {
            resetForm();
            setTouchedFields({ nameEn: false, nameAr: false });
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      if (initialData) {
        formik.setValues({
          nameEn: initialData.name?.english || "",
          nameAr: initialData.name?.arabic || "",
        });
      } else {
        formik.resetForm();
      }
      setTouchedFields({ nameEn: false, nameAr: false });
    }
  }, [open, initialData]);

  // Type-safe error checker
  const showError = (fieldName: keyof CategoryFormValues): string | false => {
    return touchedFields[fieldName] && formik.errors[fieldName] 
      ? formik.errors[fieldName] as string 
      : false;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
    style={{marginTop : "0"}}>
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* MODAL */}
      <div className="relative bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4">
          {initialData
            ? t("restaurant.menu.edit_category")
            : t("restaurant.menu.add_category")}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* ENGLISH NAME */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              {t("restaurant.menu.name_en")} <span className="text-red-500">*</span>
            </label>
            <input
              name="nameEn"
              placeholder={t("restaurant.menu.name_en")}
              value={formik.values.nameEn}
              onChange={formik.handleChange}
              onBlur={() => setTouchedFields({ ...touchedFields, nameEn: true })}
              className={`input w-full ${showError("nameEn") ? "border-red-500" : ""}`}
            />
            {showError("nameEn") && (
              <p className="text-red-500 text-xs mt-1">{showError("nameEn")}</p>
            )}
          </div>

          {/* ARABIC NAME */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              {t("restaurant.menu.name_ar")} <span className="text-red-500">*</span>
            </label>
            <input
              name="nameAr"
              placeholder={t("restaurant.menu.name_ar")}
              value={formik.values.nameAr}
              onChange={formik.handleChange}
              onBlur={() => setTouchedFields({ ...touchedFields, nameAr: true })}
              className={`input w-full ${showError("nameAr") ? "border-red-500" : ""}`}
            />
            {showError("nameAr") && (
              <p className="text-red-500 text-xs mt-1">{showError("nameAr")}</p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border hover:bg-background/60 transition"
            >
              {t("restaurant.menu.cancel")}
            </button>

            <button
              type="submit"
              disabled={isAdding || isEditing || !formik.isValid}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding || isEditing
                ? t("restaurant.menu.saving")
                : t("restaurant.menu.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}