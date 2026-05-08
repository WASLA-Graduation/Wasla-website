import { useEffect, useState, useMemo } from "react";
import useUpdateDoctorService from "../../../hooks/doctor/useUpdateDoctorService";
import {
  doctorServiceEdit,
  serviceDays,
  timeSlots,
} from "../../../types/doctor/doctorTypes";
import { useTranslation } from "react-i18next";
import { FaDeleteLeft } from "react-icons/fa6";

interface UpdateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: doctorServiceEdit;
  doctorId: string;
}

export default function UpdateServiceModal({
  isOpen,
  onClose,
  initialData,
}: UpdateServiceModalProps) {
  const { t } = useTranslation();
  const updateService = useUpdateDoctorService();

  const [serviceName, setServiceName] = useState(initialData.serviceName);
  const [description, setDescription] = useState(initialData.description);
  const [price, setPrice] = useState(initialData.price);
  const [serviceDays, setServiceDays] = useState<serviceDays[]>([]);
  const [timeSlots, setTimeSlots] = useState<timeSlots[]>([]);
  const [errors, setErrors] = useState<{
    serviceNameEn?: string;
    serviceNameAr?: string;
    descEn?: string;
    descAr?: string;
    price?: string;
    mode?: string;
    days?: string;
  }>({});
  const [slotErrors, setSlotErrors] = useState<string[]>([]);

  const weekdays = useMemo(
    () => [
      { name: t("doctor.Sat"), value: 0 },
      { name: t("doctor.Sun"), value: 1 },
      { name: t("doctor.Mon"), value: 2 },
      { name: t("doctor.Tue"), value: 3 },
      { name: t("doctor.Wed"), value: 4 },
      { name: t("doctor.Thu"), value: 5 },
      { name: t("doctor.Fri"), value: 6 },
    ],
    [t]
  );

  useEffect(() => {
    setServiceName(initialData.serviceName);
    setDescription(initialData.description);
    setPrice(initialData.price);
  }, [initialData, isOpen]);

  // slot helps
  const formatTimeBySeconds = (time: string) => {
  return `${time}:00`;
};

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const overlap = (a: timeSlots, b: timeSlots) =>
  toMinutes(a.start) < toMinutes(b.end) && toMinutes(a.end) > toMinutes(b.start);

/** VALIDATE SINGLE SLOT */
const validateSlot = (slots: timeSlots[], i: number) => {
  const s = toMinutes(slots[i].start);
  const e = toMinutes(slots[i].end);
  let msg = "";

  if (e <= s) msg = t("doctor.error.invalidSlot");
  else if (e - s > 60) msg = t("doctor.slotMaxHour");

  return msg;
};

/** CHECK FULL LIST */
const rebuildErrors = (slots: timeSlots[]) => {
  const errs = Array(slots.length).fill("");

  slots.forEach((s, i) => {
    errs[i] = validateSlot(slots, i);      // basic check
    slots.forEach((x, j) => {
      if (i !== j && overlap(s, x)) errs[i] = t("doctor.error.slotOverlap");
    });
  });

  return errs;
};

/** ADD SLOT SMART */
const addSlot = () => {
  let start = 9 * 60; // 09:00 baseline
  if (timeSlots.length) {
    const last = timeSlots[timeSlots.length - 1];
    start = toMinutes(last.end) + 1;
  }
  const end = Math.min(start + 60, 1439);
  const newList = [...timeSlots, { start: toHHMM(start), end: toHHMM(end) }];
  setTimeSlots(newList);
  setSlotErrors(rebuildErrors(newList));
};

/** CHANGE HANDLERS */
const onChangeStart = (i: number, val: string) => {
  const copy = [...timeSlots];
  copy[i].start = val;
  if (toMinutes(copy[i].end) <= toMinutes(val))
    copy[i].end = toHHMM(toMinutes(val) + 1);
  copy.sort((a,b)=>toMinutes(a.start)-toMinutes(b.start));
  setTimeSlots(copy);
  setSlotErrors(rebuildErrors(copy));
};

const onChangeEnd = (i: number, val: string) => {
  const copy = [...timeSlots];
  copy[i].end = val;
  if (toMinutes(val) - toMinutes(copy[i].start) > 60)
    copy[i].end = toHHMM(toMinutes(copy[i].start) + 60);
  copy.sort((a,b)=>toMinutes(a.start)-toMinutes(b.start));
  setTimeSlots(copy);
  setSlotErrors(rebuildErrors(copy));
};

const deleteSlot = (i:number)=>{
  const updated = timeSlots.filter((_,x)=>x!==i);
  setTimeSlots(updated);
  setSlotErrors(rebuildErrors(updated));
};

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!serviceName.english)
      newErrors.serviceNameEn = t("doctor.error.namEreq");
    if (!serviceName.arabic)
      newErrors.serviceNameAr = t("doctor.error.namAreq");
    if (!description.english) newErrors.descEn = t("doctor.error.descEreq");
    if (!description.arabic) newErrors.descAr = t("doctor.error.descAreq");
    if (!price || price < 1) newErrors.price = t("doctor.error.pospri");
    if (serviceDays.length === 0)
      newErrors.days = t("doctor.error.dayleas");

    setErrors(newErrors);
    if (Object.keys(newErrors).length || slotErrors.some((e) => e)) return;

    const payload: doctorServiceEdit = {
      serviceId: initialData.serviceId,
      serviceName,
      description,
      price,
      serviceDays: serviceDays,
      timeSlots: timeSlots.map((s) => ({
        start: s.start.length === 5 ? formatTimeBySeconds(s.start) : s.start,
        end: s.end.length === 5 ? formatTimeBySeconds(s.end)  : s.end,
      })),
    };

    updateService.mutate(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center text-black justify-center p-3">
      <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl text-black font-semibold mb-4">{t("doctor.updateServ")}</h2>
        {/* NAME */}
        <TwoColumn>
          <Input
            label={t("doctor.ServiceName") + "(EN)"}
            value={serviceName.english}
            onChange={(v) => setServiceName({ ...serviceName, english: v })}
          />
          {errors.serviceNameEn && <Error>{errors.serviceNameEn}</Error>}
          <Input
            label={t("doctor.ServiceName") + "(AR)"}
            value={serviceName.arabic}
            onChange={(v) => setServiceName({ ...serviceName, arabic: v })}
          />
          {errors.serviceNameAr && <Error>{errors.serviceNameAr}</Error>}
        </TwoColumn>

        {/*  DESCRIPTION  */}
        <TwoColumn>
          <TextArea
            label={t("doctor.desc") + "(EN)"}
            value={description.english}
            onChange={(v) => setDescription({ ...description, english: v })}
          />
          <TextArea
            label={t("doctor.desc") + "(AR)"}
            value={description.arabic}
            onChange={(v) => setDescription({ ...description, arabic: v })}
          />
        </TwoColumn>

        {/*  PRICE  */}
        <Input
          type="number"
          label={t("doctor.Price")}
          value={price}
          onChange={(v) => setPrice(Number(v))}
        />
        {errors.price && <Error>{errors.price}</Error>}

        {/*  WEEKLY DAYS  */}
            <SectionLabel>{t("doctor.Days")}</SectionLabel>
            <div className="flex flex-wrap gap-2 mt-1">
              {weekdays.map((day) => {
                const selected = serviceDays.some(
                  (d) => d.dayOfWeek === day.value
                );
                return (
                  <button
                    key={day.value}
                    onClick={() =>
                      setServiceDays(
                        selected
                          ? serviceDays.filter((d) => d.dayOfWeek !== day.value)
                          : [...serviceDays, { dayOfWeek: day.value }]
                      )
                    }
                    className={`px-3 py-1 rounded-md border ${
                      selected ? "bg-primary text-white" : "bg-gray-100"
                    }`}>
                    {day.name}
                  </button>
                );
              })}
            </div>
            {errors.days && <Error>{errors.days}</Error>}
        {/* TIME SLOTS  */}
        <SectionLabel>{t("doctor.TimeSlots")}</SectionLabel>
        {timeSlots.map((slot, i) => (
          <div key={i} className="flex gap-2 items-center mb-1">
            <input
type="time"
  value={slot.start}
  onChange={(e) => onChangeStart(i, e.target.value)}
              className="border p-1 rounded"
            />
            <span>{t("doctor.to")}</span>
            <input
              type="time"
              value={slot.end}
               onChange={(e) => onChangeEnd(i, e.target.value)}
              className="border p-1 rounded"
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
  className="bg-primary text-white px-3 py-1 rounded-md my-2"
>
  {t("doctor.AddSlot")}
</button>

        {/*  FOOTER  */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md">
            {t("doctor.Cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded-md">
            {t("doctor.Update")}
          </button>
        </div>
      </div>
    </div>
  );
}

/*  COMPONENTS  */
interface SectionLabelProps {
  children: React.ReactNode;
}
const SectionLabel = ({ children }: SectionLabelProps) => (
  <p className="font-medium mb-1">{children}</p>
);
interface TwoColumnProps {
  children: React.ReactNode;
}

const TwoColumn = ({ children }: TwoColumnProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">{children}</div>
);
interface ErrorProps {
  children: React.ReactNode;
}

const Error = ({ children }: ErrorProps) => (
  <p className="text-red-500 text-sm mt-1">{children}</p>
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
  onChange: (value: string) => void;
}) => (
  <div>
    <label className="font-medium">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-3 py-2 rounded-md mt-1"
    />
  </div>
);

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const TextArea = ({ label, value, onChange }: TextAreaProps) => (
  <div>
    <label className="font-medium">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-3 py-2 rounded-md mt-1"
    />
  </div>
);

