import { useMutation } from "@tanstack/react-query";
import { uploadIdentity } from "../../api/admin/admin-api";

export default function useUploadIdentity() {
  return useMutation({
    mutationKey: ["upload-id"],
    mutationFn: ({ NationalI, gmail }: { NationalI: string; gmail: string }) =>
      uploadIdentity(NationalI, gmail),
  });
}
