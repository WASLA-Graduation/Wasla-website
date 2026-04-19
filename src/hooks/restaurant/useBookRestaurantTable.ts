import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserEvent } from "../../utils/enum";
import useCreateEvent from "../userEvent/useCreateEvent";
import { bookARestaurantTable } from "../../api/restaurant/restaurant-api";
import { addTableData } from "../../types/restaurant/restaurant-types";

export default function useBookRestaurantTable() {
  const queryClient = useQueryClient();
  const createEvent = useCreateEvent();

  return useMutation({
    mutationKey: ["book-table"],
    mutationFn: (values: addTableData) => bookARestaurantTable(values),
    onSuccess: (_data, variables) => {
      const userId = variables.userId;
      const serviceProviderId = variables.restaurantId;

      createEvent.mutate({
        userId,
        serviceProviderId,
        eventType: UserEvent.booking,
      });

      queryClient.invalidateQueries({ queryKey: ["table-booking"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["reversation-book"], exact: false });
    },
  });
}
