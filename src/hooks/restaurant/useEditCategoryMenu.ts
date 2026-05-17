import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  editCategoryMenu } from "../../api/restaurant/restaurant-api";
import {  editCategoryMenuData } from "../../types/restaurant/restaurant-types";

export default function useEditCategoryMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-category"],
    mutationFn: (formData: editCategoryMenuData) => editCategoryMenu(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-menu"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}