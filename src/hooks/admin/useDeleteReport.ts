import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReport } from "../../api/admin/admin-api";

export default function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-report"],
    mutationFn: (id:number) => deleteReport(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}