import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  reversationData,
  updateReservationData,
} from "../../../types/restaurant/restaurant-types";

interface Props {
  booking: reversationData;
  onClose: () => void;
  onSubmit: (data: updateReservationData) => void;
  isLoading: boolean;
}

export default function EditReservationModal({
  booking,
  onClose,
  onSubmit,
  isLoading,
}: Props) {
  const { t } = useTranslation();

  const [numberOfPersons, setNumberOfPersons] = useState(
    booking.numberOfPersons
  );

  const [reservationDate, setReservationDate] = useState(
    booking.reservationDate.split("T")[0]
  );

  const [reservationTime, setReservationTime] = useState(
    booking.reservationTime
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {};

    const today = new Date();
    const selectedDate = new Date(reservationDate);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (numberOfPersons > 20)
      newErrors.numberOfPersons = t("restaurant.maxPersons");

    if (!reservationDate) {
      newErrors.date = t("restaurant.required");
    } else if (selectedDate < today) {
      newErrors.date = t("restaurant.futureDate");
    }

    if (!reservationTime)
      newErrors.time = t("restaurant.required");

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      reservationId: booking.id,
      numberOfPersons,
      reservationDate,
      reservationTime,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      style={{ marginTop: "0" }}>
      <div className="bg-background w-full max-w-md rounded-2xl p-6 shadow-xl animate-fadeIn ml-2 mr-2">
        {/* HEADER */}
        <h2 className="text-xl font-bold mb-4 text-center">
          ✏️ {t("restaurant.editReservation")}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* PERSONS */}
          <div className="mb-3">
            <label className="text-sm">
              {t("restaurant.persons")}
            </label>

            <input
              type="number"
              min={1}
              max={20}
              value={numberOfPersons}
              onChange={(e) =>
                setNumberOfPersons(+e.target.value)
              }
              className="w-full bg-background text-foreground border rounded-lg p-2 mt-1"
            />

            {errors.numberOfPersons && (
              <p className="text-red-500 text-xs mt-1">
                {errors.numberOfPersons}
              </p>
            )}
          </div>

          {/* DATE */}
          <div className="mb-3">
            <label className="text-sm">
              {t("restaurant.date")}
            </label>

            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={reservationDate}
              onChange={(e) =>
                setReservationDate(e.target.value)
              }
              className="w-full bg-background text-foreground border rounded-lg p-2 mt-1"
            />

            {errors.date && (
              <p className="text-red-500 text-xs mt-1">
                {errors.date}
              </p>
            )}
          </div>

          {/* TIME */}
          <div className="mb-4">
            <label className="text-sm">
              {t("restaurant.time")}
            </label>

            <input
              type="time"
              value={reservationTime}
              onChange={(e) =>
                setReservationTime(e.target.value)
              }
              className="w-full bg-background text-foreground border rounded-lg p-2 mt-1"
            />

            {errors.time && (
              <p className="text-red-500 text-xs mt-1">
                {errors.time}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-lg py-2">
              {t("resident.Cancel")}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-white rounded-lg py-2 hover:opacity-90">
              {isLoading
                ? t("restaurant.saving")
                : t("restaurant.Save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}