import { useQuery } from "@tanstack/react-query";
import { getAvalabilityOfRestaurant } from "../../api/restaurant/restaurant-api";

export default function useGetRestaurantAvalability(userId:string){
    return useQuery({
        queryKey:["restaurant-status" , userId],
        queryFn: ()=> getAvalabilityOfRestaurant(userId),
    })
}