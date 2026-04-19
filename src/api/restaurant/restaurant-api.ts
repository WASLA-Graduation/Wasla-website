import axios, { AxiosError } from "axios";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";
import { addTableData, restaurantDetailsData, reversationDashboardData, reversationData, showAllRestaurants } from "../../types/restaurant/restaurant-types";

interface SpicialzedcatData {
  id:number,
  name: string,
};
export async function allRestaurantSpecialzed(): Promise<SpicialzedcatData[]> {
  const response = await axiosInstance.get(`RestaurantCategory/GetAll`);
  return response.data.data;
}

export async function setRestaurantProfile(formData: FormData) {
  try {
    const response = await axiosInstance.post("Restaurant/CompleteProfile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data.message || "Restaurant profile completed successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Registration failed";
    toast.error(errorMessage);
    throw error;
  }
}

export async function EditRestaurnatProfile(formData: FormData) {
   try {
    const response = await axiosInstance.put(`Restaurant/UpdateRestaurant`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success(response.data.message || "profile Updated successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Updated failed";
    toast.error(errorMessage);
    throw error;
  }
}

interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export async function fetchAllRestaurant(
  pageNumber: number = 1,
  pageSize: number = 6,
  id:number,
): Promise<PaginatedResponse<showAllRestaurants>> {
  try {
    const response = await axiosInstance.get(
      `Restaurant/Restaurants?id=${id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
      axiosError.response?.data?.message || "Failed to fetch restaurants";
    toast.error(errorMessage);
    throw error;
  }
}

export async function getRestaurantProfile(id: string): Promise<restaurantDetailsData> {
  try {
    const response = await axiosInstance.get(`Restaurant?id=${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Fetched failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
  }
}

export async function bookARestaurantTable(formData: addTableData) {
  try {
    const response = await axiosInstance.post("Reservation/Reservation", formData);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}

export async function getReverstaionForResident(
  pageNumber: number = 1,
  pageSize: number = 6,
  id: string,
): Promise<PaginatedResponse<reversationData>> {
  try {
    const response = await axiosInstance.get(
      `Reservation/ResidentReservations?id=${id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
      axiosError.response?.data?.message || "Failed to fetch Reversation Books";
    toast.error(errorMessage);
    throw error;
  }
}

export async function changeStatusReversation(reversationId: number , status:number) {
   try {
    const response = await axiosInstance.put(`Reservation/ChangeStatus?reservationId=${reversationId}&status=${status}`);
    toast.success(response.data.message || "Book Changed successfully");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "changed failed";
    toast.error(errorMessage);
    throw error;
  }
}

export async function getReversationsForDashboard(
  pageNumber: number = 1,
  pageSize: number = 6,
  id: string,
): Promise<PaginatedResponse<reversationDashboardData>> {
  try {
    const response = await axiosInstance.get(
      `Reservation/RestaurantReservations?id=${id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
      axiosError.response?.data?.message || "Failed to fetch Reversation Books";
    toast.error(errorMessage);
    throw error;
  }
}