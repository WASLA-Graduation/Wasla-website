/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeStatusReversation } from "../../api/restaurant/restaurant-api";

type ChangeStatusPayload = {
  reversationId: number;
  status: number;
  isResident : boolean
};

export default function useChangeReversationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["change-reversation"],
    mutationFn: ({ reversationId, status, isResident }: ChangeStatusPayload) =>
      changeStatusReversation(reversationId, status, isResident),

    onMutate: async ({ reversationId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["table-booking"] });
      await queryClient.cancelQueries({ queryKey: ["reversation-book"] });

      const previousBookings = queryClient.getQueryData(["table-booking"]);
      const previousReservations = queryClient.getQueryData(["reversation-book"]);

      queryClient.setQueryData(["table-booking"], (oldData: any) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((booking: any) =>
            booking.id === reversationId 
              ? { ...booking, status } 
              : booking
          ),
        };
      });

      queryClient.setQueryData(["reversation-book"], (oldData: any) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((booking: any) =>
            booking.id === reversationId 
              ? { ...booking, status } 
              : booking
          ),
        };
      });

      return { previousBookings, previousReservations };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(["table-booking"], context.previousBookings);
      }
      if (context?.previousReservations) {
        queryClient.setQueryData(["reversation-book"], context.previousReservations);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reversation-book"] });
      queryClient.invalidateQueries({ queryKey: ["table-booking"] });
    },
  });
}