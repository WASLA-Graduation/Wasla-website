import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRestaurantCategory } from "../../api/admin/admin-api";
import { restaurantCategoryData } from "../../types/admin/adminTypes";

export default function useAddRestaurantCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-res-cat"],
    mutationFn: (formData: restaurantCategoryData) => addRestaurantCategory(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-special"] });
    },
  });
}