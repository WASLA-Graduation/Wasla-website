/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaCamera } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useEditTechnicianProfile from "../../../hooks/technican/useEditTechnicianProfile";
import useGetTechnicanSpecial from "../../../hooks/technican/useGetTechnicanSpecial";

export default function EditTechnicianProfileModal({
  isOpen,
  onClose,
  data,
}: any) {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useEditTechnicianProfile();
  const { data: specs } = useGetTechnicanSpecial();
  const userId = sessionStorage.getItem("user_id");
  const [preview, setPreview] = useState<string | null>(data.profilePhotoUrl);
  const [docNames, setDocNames] = useState<string[]>([]);

  const validationSchema = Yup.object({
    FullName: Yup.string().required(t("profile.tech.namereq")),
    Phone: Yup.string().required(t("profile.tech.phonereq")),
    BirthDay: Yup.string().required(t("profile.tech.birthreq")),
    ExperienceYears: Yup.number().required(),
    Description: Yup.string().required(),
    Specialty: Yup.number().required(),
    Documents: Yup.array().max(3, t("profile.tech.maxFiles")),
  });

  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    formData.append("Id", userId!);
    formData.append("FullName", values.FullName);
    formData.append("Phone", values.Phone);
    formData.append("BirthDay", values.BirthDay);
    formData.append("ExperienceYears", values.ExperienceYears);
    formData.append("Description", values.Description);
    formData.append("Specialty", values.Specialty);

    if (values.ProfilePhoto) {
      formData.append("ProfilePhoto", values.ProfilePhoto);
    }

    if (values.Documents?.length > 0) {
      values.Documents.forEach((file: File) => {
        formData.append("Documents", file);
      });
    }

    await mutateAsync(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-background w-full max-w-2xl rounded-xl p-4 sm:p-6 shadow-xl border border-border overflow-y-auto max-h-[95vh] my-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground text-center">
              {t("tech.editProfile")}
            </h2>

            <Formik
              initialValues={{
                FullName: data.fullName,
                Phone: data.phone,
                BirthDay: data.birthDay,
                ExperienceYears: data.experienceYears,
                Description: data.description,
                Specialty: data.specialty,
                ProfilePhoto: null,
                Documents: [],
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              {({ setFieldValue }) => (
                <Form className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* IMAGE */}
                  <div className="col-span-2 flex justify-center mb-4">
                    <label className="cursor-pointer relative">
                      <img
                        src={preview || ""}
                        loading="lazy"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-primary shadow-md"
                      />
                      <input
                        type="file"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFieldValue("ProfilePhoto", file);
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <FaCamera className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow" />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-2">
                    {/* FullName */}
                    <Input name="FullName" label={t("tech.name")} />

                    {/* Phone */}
                    <Input name="Phone" label={t("tech.phone")} />

                    {/* BirthDay */}
                    <Input
                      name="BirthDay"
                      type="date"
                      label={t("tech.birthday")}
                    />

                    {/* Experience */}
                    <Input
                      name="ExperienceYears"
                      type="number"
                      label={t("tech.experience")}
                    />
                  </div>

                  {/* Specialty */}
                  <div className="flex flex-col min-w-[200px]">
                    <label className="mb-1 text-sm font-medium text-foreground">
                      {t("tech.specialization")}
                    </label>
                    <Field
                      as="select"
                      name="Specialty"
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition">
                      {specs?.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="Specialty"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-2 flex flex-col">
                    <label className="mb-1 text-sm font-medium text-foreground">
                      {t("tech.description")}
                    </label>
                    <Field
                      as="textarea"
                      name="Description"
                      rows={5}
                      placeholder={t("tech.describePlaceholder")}
                      className="p-3 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                    <ErrorMessage
                      name="Description"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Documents */}
                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="mb-1 text-sm font-medium text-foreground">
                      {t("tech.documents")}
                    </label>

                    <input
                      type="file"
                      multiple
                      className="cursor-pointer"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 3) return;
                        setFieldValue("Documents", files);
                        setDocNames(files.map((f) => f.name));
                      }}
                    />

                    {docNames.map((n, i) => (
                      <p key={i} className="text-primary text-sm">
                        ✅ {n}
                      </p>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
                      {isPending ? t("profile.Saving...") : t("tech.save")}
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 border border-border py-3 rounded-lg hover:bg-muted/20 transition">
                      {t("tech.cancel")}
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

function Input({ name, label, type = "text" }: any) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-foreground">
        {label}
      </label>
      <Field
        name={name}
        type={type}
        className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-xs mt-1"
      />
    </div>
  );
}
