import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReservation } from "../../api/restaurant/restaurant-api";
import { updateReservationData } from "../../types/restaurant/restaurant-types";

export default function useUpdateResevation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-reversation"],
    mutationFn: (payload: updateReservationData) => updateReservation(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reversation-book"] });
      queryClient.invalidateQueries({ queryKey: ["table-booking"] });
    },
  });
}