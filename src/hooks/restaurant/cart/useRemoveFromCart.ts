import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItemCart } from "../../../api/restaurant/restaurant-api";

export default function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["remove-cart"],
    mutationFn: ({
      cartItemId,
      residentId,
    }: {
      cartItemId: number;
      residentId: string;
    }) => deleteItemCart(cartItemId, residentId),

    onMutate: async ({ cartItemId }) => {
  await queryClient.cancelQueries({
    queryKey: ["cart"],
  });

  const previousCart = queryClient.getQueryData(["cart"]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryClient.setQueryData(["cart"], (old: any[]) =>
    old.filter((item) => item.cartItemId !== cartItemId)
  );

  return { previousCart };
},

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}