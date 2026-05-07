import axios, { AxiosError } from "axios";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";
import { AdminOverviewData, AdminUsersResponse, editrestaurantCategoryData, GetUserDetailsResponse, ReportsData, ReportsTargetData, restaurantCategoryData } from "../../types/admin/adminTypes";
import { PaginatedResponse } from "../restaurant/restaurant-api";

// reports
export async function getAdminReports() : Promise<ReportsData[]> {
    try{
    const response = await axiosInstance.get(`Admin/GetContacts`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "fetch failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
    }
}

// pagination users
export async function getAdminUsers(roleId:string | undefined , pageNumber: number , pageSize: number) : Promise<AdminUsersResponse> {
    try{
    const response = await axiosInstance.get(`Admin/UserApprove?roleId=${roleId}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "fetch failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
    }
}
// change stauts
interface changeUserData{
  userId : string,
  status:number
}
export async function changeUserStatus(params:changeUserData) {
  try{
      const response = await axiosInstance.post("Admin/ChangeUserStatus" , params);
      toast.success(response?.data?.message || "changed successfully");
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "changed failed";
    toast.error(errorMessage);
    throw error;
  }
}
// admin overview
export async function getAdminOverview() : Promise<AdminOverviewData> {
    try{
    const response = await axiosInstance.get(`Admin/CollectedCountBookings`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "fetch failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
    }
}
// view detaailes
export async function getAdminUserDetails(
  userId: string,
): Promise<GetUserDetailsResponse> {
  try {
    const response = await axiosInstance.get(
      `Admin/GetUserDetails?userId=${userId}`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "fetch failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
  }
}
// post reports
export async function toogleReport(
  id: number,
  adminId: string,
  reason?: string
) {
  try {
    // بناء الـ query params بشكل ديناميكي
    const params = new URLSearchParams({
      id: id.toString(),
      adminId,
    });

    if (reason) {
      params.append("reason", reason);
    }

    const response = await axiosInstance.put(
      `Social/Toggle_Hide?${params.toString()}`,
      {}, // مفيش body
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    toast.success(response?.data?.message || "Changed successfully");
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "An error occurred";

    toast.error(errorMessage);
    throw error;
  }
}

export async function getReportsByHidden(
  pageNumber: number = 1,
  pageSize: number = 6,
  flag: boolean,
): Promise<PaginatedResponse<ReportsTargetData>> {
  try {
    const response = await axiosInstance.get(
      `Social/Reports?PageNumber=${pageNumber}&PageSize=${pageSize}&flag=${flag}`,
    );
    const result = response.data;
    return {
      data: result.data?.data || [],
      totalCount: result.data?.totalCount || 0,
      currentPage: result.data?.pageNumber || pageNumber,
      pageSize: result.data?.pageSize || pageSize,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to fetch reports data";
    toast.error(errorMessage);
    throw error;
  }
}

export async function deleteReport(id:number) {
  try {
    const response = await axiosInstance.delete(`Social/Report?id=${id}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}
// restaurant gategory
export async function addRestaurantCategory(formData: restaurantCategoryData) {
  try {
    const response = await axiosInstance.post("RestaurantCategory/Category", formData);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}
export async function editRestaurantCategory(formData: editrestaurantCategoryData) {
  try {
    const response = await axiosInstance.put("RestaurantCategory/Category", formData);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}
export async function deleteRestaurantCategory(id:number) {
  try {
    const response = await axiosInstance.delete(`RestaurantCategory/Category?id=${id}`);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}

// upload identity
export async function uploadIdentity(NationalI: string , gmail: string) {
  try {
    const response = await axiosInstance.post(`Resident/UploadIdentity?NationalI=${NationalI}&gmail=${gmail}`);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}