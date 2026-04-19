/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field } from "formik";
import { useTranslation } from "react-i18next";
import { FaCamera, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

import useEditRestaurantProfile from "../../../hooks/restaurant/useEditRestaurantProfile";

export default function EditRestaurantProfileModal({
  isOpen,
  onClose,
  data,
  categories,
}: any) {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useEditRestaurantProfile();

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<
    { file: File; preview: string }[]
  >([]);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (data && isOpen) {
      setExistingImages(data.gallery || []);
      setPreview(data.profile);
      setNewImages([]);
    }
  }, [data, isOpen]);

  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    formData.append("id", data.id);
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("ownerName", values.ownerName);
    formData.append(
      "restaurantCategoryId",
      values.restaurantCategoryId.toString()
    );

    if (values.profile) {
      formData.append("profile", values.profile);
    }

    existingImages.forEach((img) => {
      formData.append("files.existingFiles", img);
    });

    newImages.forEach((img) => {
      formData.append("files.newFiles", img.file);
    });

    await mutateAsync(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-background w-full max-w-2xl rounded-2xl shadow-2xl border p-6 max-h-[90vh] overflow-y-auto"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {t("restaurant.editProfile")}
              </h2>
              <button onClick={onClose}>
                <FaTimes />
              </button>
            </div>

            <Formik
              initialValues={{
                name: data.name,
                description: data.description,
                phoneNumber: data.phoneNumber,
                ownerName: data.ownerName,
                restaurantCategoryId: data.restaurantCategoryId,
                profile: null,
              }}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue }) => (
                <Form className="space-y-5">

                  {/* PROFILE IMAGE */}
                  <div className="flex justify-center">
                    <label className="relative cursor-pointer group">
                      <img
                        src={preview}
                        className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow"
                      />

                      <input
                        type="file"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFieldValue("profile", file);
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full">
                        <FaCamera className="text-white text-lg" />
                      </div>
                    </label>
                  </div>

                  {/* INPUTS */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input name="name" label={t("restaurant.name")} />
                    <Input name="ownerName" label={t("restaurant.owner")} />
                    <Input name="phoneNumber" label={t("restaurant.phone")} />

                    <div>
                      <label className="text-sm mb-1 block">
                        {t("restaurant.category")}
                      </label>
                      <Field as="select" name="restaurantCategoryId" className="input bg-background">
                        {categories?.map((c: any) => (
                          <option key={c.id} value={c.id} className="bg-background">
                            {c.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="text-sm mb-1 block">
                      {t("restaurant.description")}
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      rows={4}
                      className="w-full p-3 rounded-lg border resize-none bg-background"
                    />
                  </div>

                  {/* GALLERY */}
                  <div>
                    <p className="font-semibold mb-2">
                      {t("restaurant.gallery")}
                    </p>

                    <div className="grid grid-cols-3 gap-3">

                      {/* existing */}
                      {existingImages.map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={img}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setExistingImages((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              )
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}

                      {/* new */}
                      {newImages.map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={img.preview}
                            className="w-full h-24 object-cover rounded-lg border-2 border-primary"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setNewImages((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              )
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}

                    </div>

                    {/* upload */}
                    <input
                      type="file"
                      multiple
                      className="mt-3"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const mapped = files.map((file) => ({
                          file,
                          preview: URL.createObjectURL(file),
                        }));

                        setNewImages((prev) => [...prev, ...mapped]);
                      }}
                    />
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold"
                    >
                      {isPending
                        ? t("restaurant.saving")
                        : t("restaurant.save")}
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 border py-3 rounded-lg"
                    >
                      {t("restaurant.cancel")}
                    </button>
                  </div>

                </Form>
              )}
            </Formik>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* reusable input */
function Input({ name, label }: any) {
  return (
    <div>
      <label className="text-sm mb-1 block">{label}</label>
      <Field
        name={name}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary bg-background"
      />
    </div>
  );
}