import { useQuery } from "@tanstack/react-query";
import { getReverstaionForResident } from "../../api/restaurant/restaurant-api";

export default function useGetReversationForResident(
  pageNumber: number = 1,
  pageSize: number = 10,
  id:string
) {
  return useQuery({
    queryKey: ["reversation-book", pageNumber, pageSize],
    queryFn: () => getReverstaionForResident(pageNumber, pageSize , id),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
}
