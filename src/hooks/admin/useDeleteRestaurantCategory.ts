import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRestaurantCategory } from "../../api/admin/admin-api";

export default function useDeleteRestaurantCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-res-cat"],
    mutationFn: (id:number) => deleteRestaurantCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-special"] });
    },
  });
}