import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { fetchAllRestaurant } from "../../api/restaurant/restaurant-api";

export default function useFetchAllRestaurants(
  pageNumber: number = 1,
  pageSize: number = 10,
  id:number
) {
  return useQuery({
    queryKey: ["allRestaurants", pageNumber, pageSize , i18next.language , id],
    queryFn: () => fetchAllRestaurant(pageNumber, pageSize , id),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
}
