import { useState } from "react";
import useAddDoctorService from "../../../hooks/doctor/useAddDoctorService";
import {
  doctorServiceAdd,
  serviceDays,
  timeSlots,
} from "../../../types/doctor/doctorTypes";
import { useTranslation } from "react-i18next";
import { FaDeleteLeft } from "react-icons/fa6";

export default function AddServiceModal({
  isOpen,
  onClose,
  doctorId,
}: {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
}) {
  const { t } = useTranslation();
  const addService = useAddDoctorService();

  const [serviceName, setServiceName] = useState({ english: "", arabic: "" });
  const [description, setDescription] = useState({ english: "", arabic: "" });
  const [price, setPrice] = useState<number>(0);

  const [serviceDays, setServiceDays] = useState<serviceDays[]>([]);
  const [timeSlots, setTimeSlots] = useState<timeSlots[]>([]);
  const [slotErrors, setSlotErrors] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const weekdays = [
    { name: t("doctor.Sat"), value: 0 },
    { name: t("doctor.Sun"), value: 1 },
    { name: t("doctor.Mon"), value: 2 },
    { name: t("doctor.Tue"), value: 3 },
    { name: t("doctor.Wed"), value: 4 },
    { name: t("doctor.Thu"), value: 5 },
    { name: t("doctor.Fri"), value: 6 },
  ];

  if (!isOpen) return null;

  /*  TIME SLOT HELPERS  */
  const formatTimeBySeconds = (time: string) => {
  return `${time}:00`;
};
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const toHHMM = (min: number) =>
    `${String((min / 60) | 0).padStart(2, "0")}:${String(min % 60).padStart(
      2,
      "0"
    )}`;
  const overlap = (a: timeSlots, b: timeSlots) =>
    toMinutes(a.start) < toMinutes(b.end) &&
    toMinutes(a.end) > toMinutes(b.start);

  const validateSlot = (slots: timeSlots[], i: number) => {
    const s = toMinutes(slots[i].start);
    const e = toMinutes(slots[i].end);
    if (e <= s) return t("doctor.error.invalidSlot");
    if (e - s > 60) return t("doctor.slotMaxHour");
    return "";
  };

  const rebuildErrors = (slots: timeSlots[]) => {
    const errs = Array(slots.length).fill("");
    slots.forEach((s, i) => {
      errs[i] = validateSlot(slots, i);
      slots.forEach(
        (x, j) =>
          i !== j && overlap(s, x) && (errs[i] = t("doctor.error.slotOverlap"))
      );
    });
    return errs;
  };

  const addSlot = () => {
    let start = 9 * 60;
    if (timeSlots.length) {
      const last = timeSlots[timeSlots.length - 1];
      start = toMinutes(last.end) + 1;
    }
    const end = Math.min(start + 60, 1439);
    const newList = [...timeSlots, { start: toHHMM(start), end: toHHMM(end) }];
    setTimeSlots(newList);
    setSlotErrors(rebuildErrors(newList));
  };

  const onChangeStart = (i: number, val: string) => {
    const copy = [...timeSlots];
    copy[i].start = val;
    if (toMinutes(copy[i].end) <= toMinutes(val))
      copy[i].end = toHHMM(toMinutes(val) + 1);
    copy.sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    setTimeSlots(copy);
    setSlotErrors(rebuildErrors(copy));
  };

  const onChangeEnd = (i: number, val: string) => {
    const copy = [...timeSlots];
    copy[i].end = val;
    if (toMinutes(val) - toMinutes(copy[i].start) > 60)
      copy[i].end = toHHMM(toMinutes(copy[i].start) + 60);
    copy.sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    setTimeSlots(copy);
    setSlotErrors(rebuildErrors(copy));
  };

  const deleteSlot = (i: number) => {
    const updated = timeSlots.filter((_, x) => x !== i);
    setTimeSlots(updated);
    setSlotErrors(rebuildErrors(updated));
  };

  /*  SUBMIT  */
  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!serviceName.english) e.serviceNameEn = t("doctor.error.namEreq");
    if (!serviceName.arabic) e.serviceNameAr = t("doctor.error.namAreq");
    if (!description.english) e.descEn = t("doctor.error.descEreq");
    if (!description.arabic) e.descAr = t("doctor.error.descAreq");
    if (!price || price < 1) e.price = t("doctor.error.pospri");
    if (!serviceDays.length) e.days = t("doctor.error.dayleas");

    setErrors(e);
    if (Object.keys(e).length || slotErrors.some((x) => x)) return;

    const payload: doctorServiceAdd = {
      doctorId,
      serviceName,
      description,
      price,
      serviceDays: serviceDays,
      timeSlots: timeSlots.map((s) => ({
        start: formatTimeBySeconds(s.start),
        end: formatTimeBySeconds(s.end),
      })),
    };

    addService.mutate(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl text-black overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">{t("doctor.addServ")}</h2>

        {/*NAME*/}
        <TwoColumn>
          <Input
            label="Service Name (EN)"
            value={serviceName.english}
            onChange={(v) => setServiceName({ ...serviceName, english: v })}
          />
          {errors.serviceNameEn && <Error>{errors.serviceNameEn}</Error>}

          <Input
            label="Service Name (AR)"
            value={serviceName.arabic}
            onChange={(v) => setServiceName({ ...serviceName, arabic: v })}
          />
          {errors.serviceNameAr && <Error>{errors.serviceNameAr}</Error>}
        </TwoColumn>

        {/*DESCRIPTION*/}
        <TwoColumn>
          <TextArea
            label="Description (EN)"
            value={description.english}
            onChange={(v) => setDescription({ ...description, english: v })}
          />
          <TextArea
            label="Description (AR)"
            value={description.arabic}
            onChange={(v) => setDescription({ ...description, arabic: v })}
          />
        </TwoColumn>

        {/* PRICE*/}
        <Input
          label={t("doctor.Price")}
          type="number"
          value={price}
          onChange={(v) => setPrice(Number(v))}
        />
        {errors.price && <Error>{errors.price}</Error>}

        {/* WEEKLY DAYS */}
        <SectionLabel>{t("doctor.Days")}</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {weekdays.map((day) => {
            const selected = serviceDays.some((d) => d.dayOfWeek === day.value);
            return (
              <button
                key={day.value}
                className={`px-3 py-1 rounded-md border ${
                  selected ? "bg-primary text-white" : "bg-gray-100"
                }`}
                onClick={() =>
                  setServiceDays(
                    selected
                      ? serviceDays.filter((d) => d.dayOfWeek !== day.value)
                      : [...serviceDays, { dayOfWeek: day.value }]
                  )
                }>
                {day.name}
              </button>
            );
          })}
        </div>
        {errors.days && <Error>{errors.days}</Error>}

        {/*  TIME SLOTS */}
        <SectionLabel>{t("doctor.TimeSlots")}</SectionLabel>
        {timeSlots.map((slot, i) => (
          <div key={i} className="flex gap-2 items-center mb-1">
            <input
              type="time"
              value={slot.start}
              onChange={(e) => onChangeStart(i, e.target.value)}
              className="border rounded p-1"
            />
            <span>{t("doctor.to")}</span>
            <input
              type="time"
              value={slot.end}
              onChange={(e) => onChangeEnd(i, e.target.value)}
              className="border rounded p-1"
            />
            <button
              onClick={() => deleteSlot(i)}
              className="px-2 py-1 bg-red-500 text-white rounded">
              <FaDeleteLeft />
            </button>
            {slotErrors[i] && <Error>{slotErrors[i]}</Error>}
          </div>
        ))}

        <button
          onClick={addSlot}
          className="bg-primary text-white px-3 py-1 rounded-md">
          {t("doctor.AddSlot")}
        </button>

        {/* FOOTER*/}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md">
            {t("doctor.Cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded-md">
            {t("doctor.Add")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS*/
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="font-medium mb-1">{children}</p>
);
const Error = ({ children }: { children: React.ReactNode }) => (
  <p className="text-red-500 text-sm">{children}</p>
);
const TwoColumn = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">{children}</div>
);

const Input = ({
  label,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  value: string | number;
  type?: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label>{label}</label>
    <input
      value={value}
      type={type}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-3 py-2 rounded-md mt-1"
    />
  </div>
);

const TextArea = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label>{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-3 py-2 rounded-md mt-1"
    />
  </div>
);
