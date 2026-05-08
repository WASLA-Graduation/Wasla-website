import { useState } from "react";
import useEditDoctorProfile from "../../../hooks/doctor/useEditDoctorProfile";
import { doctorProfileData } from "../../../types/doctor/doctorTypes";
import useDoctorSpecialezed from "../../../hooks/completeProfile/useDoctorSpecialized";
import { SpicialzedData } from "../../../api/auth/complete-profile";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { FaCamera } from "react-icons/fa";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: doctorProfileData;
}

export default function NewEditDoctorProfileModal({
  isOpen,
  onClose,
  data,
}: EditProfileModalProps) {
  const { t } = useTranslation();
  const { mutate, isPending } = useEditDoctorProfile();
  const { data: specs, isLoading: loadingSpecs } = useDoctorSpecialezed();

  const userId = sessionStorage.getItem("user_id");

  // Initial States
  const [fullName, setFullName] = useState(data.fullName);
  const [phone, setPhone] = useState(data.phone);
  const [birthDay, setBirthDay] = useState(data.birthDay?.split("T")[0]);
  const [experienceYears, setExperienceYears] = useState(data.experienceYears);
  const [universityName, setUniversityName] = useState(data.universityName);
  const [graduationYear, setGraduationYear] = useState(data.graduationYear);
  const [hospitalname, setHospitalName] = useState(data.hospitalname);

  const [specializationId, setSpecializationId] = useState<number | "">("");

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [cv, setCv] = useState<File | null>(null);

  const handleSubmit = () => {
    // validation
    if (!fullName) return toast.error(t("profile.doctor.namereq"));
    if (!phone) return toast.error(t("profile.doctor.phonereq"));
    if (phone.length !== 11) return toast.error(t("profile.doctor.phonemin"));
    if (!birthDay) return toast.error(t("profile.doctor.birthreq"));
    if (!experienceYears) return toast.error(t("profile.doctor.exreq"));
    if (!universityName) return toast.error(t("profile.doctor.unireq"));
    if (!hospitalname) return toast.error(t("profile.doctor.hosreq"));
    if (!graduationYear) return toast.error(t("profile.doctor.gradreq"));
    if (!specializationId) return toast.error(t("profile.doctor.spireq"));

    // File validation
    if (cv) {
      const allowed = ["application/pdf", "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

      if (!allowed.includes(cv.type)) {
        return toast.error("Only PDF and DOC/DOCX are allowed");
      }
    }

    const formData = new FormData();
    formData.append("userId", userId!);
    formData.append("fullName", fullName);
    formData.append("phone", phone);
    formData.append("birthDay", birthDay);
    formData.append("experienceYears", String(experienceYears));
    formData.append("universityName", universityName);
    formData.append("graduationYear", String(graduationYear));
    formData.append("hospitalname", hospitalname);
    formData.append("specializationId", String(specializationId));

    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    if (cv) formData.append("cv", cv);

    mutate(formData, { onSuccess: () => onClose() });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background w-full max-w-2xl  ml-2 mr-2 rounded-lg p-6 shadow-xl overflow-y-auto max-h-[90vh]">

        <h2 className="text-2xl font-bold mb-4">{t("profile.doctor.edit")}</h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-5">
          <label htmlFor="image-upload" className="cursor-pointer relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center bg-muted">
              {previewImage ? (
                <img src={previewImage} alt="preview" loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <FaCamera className="text-gray-400 w-10 h-10" />
              )}
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setProfilePhoto(file);
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        {/* Name */}
        <label className="block mb-2 font-medium">{t("profile.doctor.name")}</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border rounded bg-background p-2 mb-4"
        />

        {/* Phone */}
        <label className="block mb-2 font-medium">{t("profile.doctor.Phone")}</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded bg-background p-2 mb-4"
        />

        {/* Birthday */}
        <label className="block mb-2 font-medium">{t("profile.doctor.Birthday")}</label>
        <input
          type="date"
          value={birthDay}
          onChange={(e) => setBirthDay(e.target.value)}
          className="w-full border rounded bg-background p-2 mb-4"
        />

        {/* Experience */}
        <label className="block mb-2 font-medium">{t("profile.doctor.Experience")}</label>
        <input
          type="number"
          value={experienceYears}
          onChange={(e) => setExperienceYears(Number(e.target.value))}
          className="w-full border rounded bg-background p-2 mb-4"
        />

        {/* University */}
        <label className="block mb-2 font-medium">{t("profile.doctor.University")}</label>
        <input
          type="text"
          value={universityName}
          onChange={(e) => setUniversityName(e.target.value)}
          className="w-full border rounded bg-background p-2 mb-4"
        />

        {/* Hospital */}
        <label className="block mb-2 font-medium">{t("profile.doctor.hos")}</label>
        <input
          type="text"
          value={hospitalname}
          onChange={(e) => setHospitalName(e.target.value)}
          className="w-full border rounded bg-background p-2 mb-4"
        />

        {/* Specialization */}
        <label className="block mb-2 font-medium">{t("profile.doctor.Specialization")}</label>
        {loadingSpecs ? (
          <div className="text-gray-500 mb-4">Loading…</div>
        ) : (
          <select
            value={specializationId}
            onChange={(e) => setSpecializationId(Number(e.target.value))}
            className="w-full border rounded bg-background p-2 mb-4"
          >
            <option value="">{t("profile.doctor.selectspi")}</option>
            {specs?.map((spec: SpicialzedData) => (
              <option key={spec.id} value={spec.id}>{spec.name}</option>
            ))}
          </select>
        )}

        {/* Graduation */}
        <label className="block mb-2 font-medium">{t("profile.doctor.Graduation")}</label>
        <input
          type="number"
          value={graduationYear}
          onChange={(e) => setGraduationYear(Number(e.target.value))}
          className="w-full border rounded bg-background p-2 mb-4"
        />

        {/* CV */}
        <label className="block mb-2 font-medium">{t("profile.doctor.uploadcv")}</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setCv(e.target.files?.[0] || null)}
          className="w-full border rounded bg-background p-2 mb-4"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 bg-dried text-white rounded" onClick={onClose}>
            {t("profile.doctor.close")}
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? t("profile.Saving...") : t("profile.doctor.saveDoc")}
          </button>
        </div>
      </div>
    </div>
  );
}
