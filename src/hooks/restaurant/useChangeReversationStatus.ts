import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeStatusReversation } from "../../api/restaurant/restaurant-api";

type ChangeStatusPayload = {
  reversationId: number;
  status: number;
};

export default function useChangeReversationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["change-reversation"],
    mutationFn: ({ reversationId, status }: ChangeStatusPayload) =>
      changeStatusReversation(reversationId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reversation-book"] });
      queryClient.invalidateQueries({ queryKey: ["table-booking"] });
    },
  });
}