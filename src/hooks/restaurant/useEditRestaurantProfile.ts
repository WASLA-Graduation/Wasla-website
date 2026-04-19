import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditRestaurnatProfile } from "../../api/restaurant/restaurant-api";

export default function useEditRestaurantProfile(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["edit-restaurant-profile"],
        mutationFn: EditRestaurnatProfile,
           onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-profile"], exact: false });
    },
    })
}