import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editItemCart } from "../../../api/restaurant/restaurant-api";

export default function useEditCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-cart"],
    mutationFn: ({
      cartItemId,
      residentId,
      quantity,
    }: {
      cartItemId: number;
      residentId: string;
      quantity: number;
    }) =>
      editItemCart(cartItemId, residentId, quantity),

      onMutate: async ({ cartItemId, quantity }) => {
  await queryClient.cancelQueries({
    queryKey: ["cart"],
  });

  const previousCart = queryClient.getQueryData(["cart"]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryClient.setQueryData(["cart"], (old: any[]) =>
    old.map((item) =>
      item.cartItemId === cartItemId
        ? {
            ...item,
            quantity,
            totalPrice: item.price * quantity,
          }
        : item
    )
  );

  return { previousCart };
},

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}