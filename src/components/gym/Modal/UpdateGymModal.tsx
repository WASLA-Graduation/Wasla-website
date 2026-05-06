import { useTranslation } from "react-i18next";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import useEditGymProfile from "../../../hooks/gym/useEditGymProfile";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: {
    businessName: string;
    ownerName: string;
    description: string;
    gmail: string;
    phones: string[];
  };
}

export default function EditGymProfileModal({
  isOpen,
  onClose,
  data,
}: Props) {
  const { t } = useTranslation();
  const { mutate, isPending } = useEditGymProfile();

  if (!isOpen) return null;

  const initialValues = {
    businessName: data.businessName || "",
    ownerName: data.ownerName || "",
    description: data.description || "",
    phones: data.phones?.length ? data.phones : [""],
    photo: null as File | null,
    photos: [] as File[],
  };

  const validationSchema = Yup.object({
    businessName: Yup.string()
      .min(3, t("profile.gym.businessMin"))
      .required(t("profile.gym.businessReq")),

    ownerName: Yup.string()
      .min(3, t("profile.gym.ownerMin"))
      .required(t("profile.gym.ownerReq")),

    description: Yup.string()
      .min(10, t("profile.gym.descMin"))
      .required(t("profile.gym.descReq")),

    phones: Yup.array()
      .of(
        Yup.string()
          .matches(/^01[0-2,5]{1}[0-9]{8}$/, t("profile.gym.phoneInvalid"))
          .required(t("profile.gym.phoneReq"))
      )
      .min(1, t("profile.gym.phoneAtLeast")),
  });

  const handleSubmit = (values: typeof initialValues) => {
    const formData = new FormData();

    formData.append("gmail", data.gmail);
    formData.append("businessName", values.businessName);
    formData.append("ownerName", values.ownerName);
    formData.append("description", values.description);
    formData.append("latitude", "0");
    formData.append("longitude", "0");

    values.phones.forEach((phone) => {
      formData.append("phones", phone);
    });

    if (values.photo) formData.append("photo", values.photo);

    values.photos.forEach((file) => {
      formData.append("photos", file);
    });

    mutate(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-2xl rounded-2xl shadow-xl border border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-border">
          <h2 className="text-xl font-bold">
            {t("profile.doctor.edit")}
          </h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-5">

                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("profile.gym.businessName")}
                  </label>
                  <Field
                    name="businessName"
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                  />
                  <ErrorMessage name="businessName" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Owner Name */}
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("gym.owner")}
                  </label>
                  <Field
                    name="ownerName"
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                  />
                  <ErrorMessage name="ownerName" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Description */}
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("gym.description")}
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={3}
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Phones */}
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("gym.phones")}
                  </label>

                  <FieldArray name="phones">
                    {({ push, remove }) => (
                      <>
                        {values.phones.map((_, index) => (
                          <div key={index} className="flex gap-2 mt-2">
                            <Field
                              name={`phones[${index}]`}
                              className="flex-1 p-2 border border-border rounded-lg"
                            />

                            {values.phones.length > 1 && (
                              <button
                                type="button"
                                className="text-red-500"
                                onClick={() => remove(index)}
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => push("")}
                          className="flex items-center gap-1 text-primary text-sm mt-2"
                        >
                          <FaPlus />
                          {t("gym.addPh")}
                        </button>
                      </>
                    )}
                  </FieldArray>

                  <ErrorMessage name="phones" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Profile Photo */}
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("admin.photo")}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      if (file) setFieldValue("photo", file);
                    }}
                  />
                </div>

                {/* Gallery */}
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("gym.gallery")}
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.currentTarget.files || []);
                      setFieldValue("photos", files);
                    }}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-border rounded-lg"
                  >
                    {t("gym.Cancel")}
                  </button>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2 bg-primary text-white rounded-lg"
                  >
                    {isPending
                      ? t("gym.Saving...")
                      : t("gym.Save")}
                  </button>
                </div>

              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
