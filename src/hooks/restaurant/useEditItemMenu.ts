import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editItemMenu } from "../../api/restaurant/restaurant-api";

type editItemPayload = {
  formData: FormData;
  id: number;
};

export default function useEditItemMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-item"],

    mutationFn: ({ formData, id }: editItemPayload) =>
      editItemMenu(formData, id),

    onSuccess: (_data, variables) => {
      const updatedId = variables.id;

      const newAvailability =
        variables.formData.get("isAvailable") === "true";

      queryClient.invalidateQueries({
        queryKey: ["item-menu"],
      });

      queryClient.invalidateQueries({
        queryKey: ["restaurant-menu"],
      });

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      queryClient.setQueriesData(
        { queryKey: ["cart"] },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (old: any[] | undefined) =>
          old?.map((item) =>
            item.menuItemId === updatedId
              ? {
                  ...item,
                  isAvailable: newAvailability,
                }
              : item
          )
      );
    },
  });
}