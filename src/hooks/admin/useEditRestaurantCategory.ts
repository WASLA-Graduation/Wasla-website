import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editRestaurantCategory } from "../../api/admin/admin-api";
import { editrestaurantCategoryData } from "../../types/admin/adminTypes";

export default function useEditRestaurantCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-res-cat"],
    mutationFn: (formData: editrestaurantCategoryData) => editRestaurantCategory(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-special"] });
    },
  });
}