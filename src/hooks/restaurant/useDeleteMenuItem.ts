import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItemMenu } from "../../api/restaurant/restaurant-api";

export default function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-item"],

    mutationFn: (id: number) => deleteItemMenu(id),

    onSuccess: (_data, id) => {
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
            item.menuItemId === id
              ? {
                  ...item,
                  isDeleted: true,
                }
              : item
          )
      );
    },
  });
}