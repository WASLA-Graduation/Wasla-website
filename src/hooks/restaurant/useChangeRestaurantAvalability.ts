import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeAvalabilityOfRestaurant } from "../../api/restaurant/restaurant-api";

export default function useChangeRestaurantAvalibitly() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["change-avalability"],
    mutationFn: () => changeAvalabilityOfRestaurant(),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-status"] });
    },
  });
}