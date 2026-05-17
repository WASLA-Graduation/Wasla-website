import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCartData } from "../../../types/restaurant/restaurant-types";
import { AddToCart } from "../../../api/restaurant/restaurant-api";

export default function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-cart"],
    mutationFn: (formData: addToCartData) => AddToCart(formData),

    onMutate: async (newItem) => {
      await queryClient.cancelQueries({
        queryKey: ["cart"],
      });

      const previousCart = queryClient.getQueryData(["cart"]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(["cart"], (old: any[] = []) => [
        ...old,
        {
          ...newItem,
          quantity: 1,
        },
      ]);

      return { previousCart };
    },

    onError: (_err, _newItem, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
