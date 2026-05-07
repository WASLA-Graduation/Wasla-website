import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelTechBook } from "../../api/technician/technician-api";

export default function useCancelTechBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["cancel-tech-book"],
    mutationFn: ({
      bookingId,
      isResident,
    }: {
      bookingId: number;
      isResident: boolean;
    }) => cancelTechBook(bookingId, isResident),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tech-book-list"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["tech-booking"],
        exact: false,
      });
    },
  });
}
