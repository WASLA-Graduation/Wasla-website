import axios, { AxiosError } from "axios";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";
import { addCategoryMenuData, addTableData, addToCartData, cartData, categoryMenuData, checkoutData, editCategoryMenuData, itemMenuData, menuData, residentTakeAway, restaurantAvalbility, restaurantChartsData, restaurantDetailsData, restaurantTakeAway, reversationDashboardData, reversationData, showAllRestaurants, updateReservationData } from "../../types/restaurant/restaurant-types";

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

export interface PaginatedResponse<T> {
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

export async function changeStatusReversation(reversationId: number , status:number , isResident: boolean) {
   try {
    const response = await axiosInstance.put(`Reservation/ChangeStatus?isResident=${isResident}&reservationId=${reversationId}&status=${status}`);
    toast.success(response.data.message || "Book Changed successfully");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "changed failed";
    toast.error(errorMessage);
    throw error;
  }
}

export async function updateReservation(formData: updateReservationData) {
  try {
    const response = await axiosInstance.put("Reservation/reservation", formData);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
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
// Category Menu
export async function addCategoryMenu(formData: addCategoryMenuData) {
  try {
    const response = await axiosInstance.post("RestaurantMenu/Category", formData);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}
export async function editCategoryMenu(formData: editCategoryMenuData) {
  try {
    const response = await axiosInstance.put("RestaurantMenu/Category", formData);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}
export async function deleteCategoryMenu(id:number) {
  try {
    const response = await axiosInstance.delete(`RestaurantMenu/Category?id=${id}`);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}

export async function getCategoryMenu(id: string): Promise<categoryMenuData[]> {
  try {
    const response = await axiosInstance.get(`RestaurantMenu/Categories?id=${id}`);
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
// item menu
export async function addItemMenu(formData: FormData) {
  try {
    const response = await axiosInstance.post("RestaurantMenu/Item", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data.message || "Item Added successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Added failed";
    toast.error(errorMessage);
    throw error;
  }
}
export async function editItemMenu(formData: FormData , id:number) {
  try {
    const response = await axiosInstance.put(`RestaurantMenu/Item?id=${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data.message || "Item Updated successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Updated failed";
    toast.error(errorMessage);
    throw error;
  }
}
export async function deleteItemMenu(id:number) {
  try {
    const response = await axiosInstance.delete(`RestaurantMenu/Item?id=${id}`);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}

export async function getMenuItems(
  pageNumber: number = 1,
  pageSize: number = 6,
  id: string,
): Promise<PaginatedResponse<itemMenuData[]>> {
  try {
    const response = await axiosInstance.get(
      `RestaurantMenu/Items?id=${id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
      axiosError.response?.data?.message || "Failed to fetch menu items";
    toast.error(errorMessage);
    throw error;
  }
}

export async function fetchChartsRestaurantData(id :string) : Promise<restaurantChartsData> {
    try{
    const response = await axiosInstance.get(`Restaurant/Charts?id=${id}`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
  }
}

export async function getMenuDataForResident(id :string) : Promise<menuData[]> {
    try{
    const response = await axiosInstance.get(`RestaurantMenu/ItemsByCategory?id=${id}`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
  }
}

export async function AddToCart(formData: addToCartData) {
  try {
    const response = await axiosInstance.post("RestaurantOrder/add-to-cart", formData);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}
export async function getCart(residentId :string , restaurantId:string) : Promise<cartData[]> {
    try{
    const response = await axiosInstance.get(`RestaurantOrder/cart-items?residentId=${residentId}&restaurantId=${restaurantId}`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
  }
}
export async function deleteItemCart(cartItemId:number , residentId:string) {
  try {
    const response = await axiosInstance.delete(`RestaurantOrder/remove-from-cart?cartItemId=${cartItemId}&residentId=${residentId}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}
export async function editItemCart(cartItemId:number , residentId:string , quantity:number) {
  try {
    const response = await axiosInstance.put(`RestaurantOrder/quantity-cart-item?cartItemId=${cartItemId}&residentId=${residentId}&quantity=${quantity}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}

export async function checkoutOrder(formData: checkoutData) {
  try {
    const response = await axiosInstance.post("RestaurantOrder/checkout", formData);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}

export async function getResidentOrders(
  pageNumber: number = 1,
  pageSize: number = 6,
  id: string,
): Promise<PaginatedResponse<residentTakeAway>> {
  try {
    const response = await axiosInstance.get(
      `RestaurantOrder/orders-resident?id=${id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
      axiosError.response?.data?.message || "Failed to fetch your orders";
    toast.error(errorMessage);
    throw error;
  }
}
export async function getRestaurantOrders(
  pageNumber: number = 1,
  pageSize: number = 6,
  id: string,
): Promise<PaginatedResponse<restaurantTakeAway>> {
  try {
    const response = await axiosInstance.get(
      `RestaurantOrder/orders-restaurant?id=${id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
      axiosError.response?.data?.message || "Failed to fetch your orders";
    toast.error(errorMessage);
    throw error;
  }
}

export async function changeToPrepare(id:number) {
  try {
    const response = await axiosInstance.put(`RestaurantOrder/start-preparing-order?id=${id}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}
export async function changeToDeliverd(id:number) {
  try {
    const response = await axiosInstance.put(`RestaurantOrder/mark-order-delivered?id=${id}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}

export async function cancelOrder(orderId: number , isResident:boolean) {
   try {
    const response = await axiosInstance.put(`RestaurantOrder/cancel-order?orderId=${orderId}&isResident=${isResident}`);
    toast.success(response.data.message || "Book Canceled successfully");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "canceled failed";
    toast.error(errorMessage);
    throw error;
  }
}
// restaurant status
export async function changeAvalabilityOfRestaurant() {
  try {
    const response = await axiosInstance.put("Restaurant/ChangeStatus");

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}

export async function getAvalabilityOfRestaurant(userId : string) : Promise<restaurantAvalbility> {
  try {
    const response = await axiosInstance.get(`Restaurant/Status?userId=${userId}`);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}

