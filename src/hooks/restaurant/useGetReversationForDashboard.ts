import { useQuery } from "@tanstack/react-query";
import { getReversationsForDashboard } from "../../api/restaurant/restaurant-api";

export default function useGetReversationForDashboard(
  pageNumber: number = 1,
  pageSize: number = 10,
  id:string
) {
  return useQuery({
    queryKey: ["table-booking", pageNumber, pageSize],
    queryFn: () => getReversationsForDashboard(pageNumber, pageSize , id),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
}
