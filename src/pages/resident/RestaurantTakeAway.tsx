// src/pages/restaurant/RestaurantTakeAway.tsx
import { useParams } from "react-router-dom";
import useGetRestaurantMenu from "../../hooks/restaurant/cart/useGetMenuForResident";
import MenuCategory from "../../components/restaurant/cart/MenuCategory";
import { useTranslation } from "react-i18next";
import { menuData } from "../../types/restaurant/restaurant-types";
import CartSection from "../../components/restaurant/cart/CartSection";
import useGetRestaurantAvalability from "../../hooks/restaurant/useGetRestaurantAvalability";
import { useRestaurantHubContext } from "../../utils/singlr/useRestaurantHub";
import { useEffect } from "react";

export default function RestaurantTakeAway() {
  const { restaurantId } = useParams();
  const { t } = useTranslation();

  const { joinRestaurantGroup, leaveRestaurantGroup } =
    useRestaurantHubContext();

  useEffect(() => {
    if (!restaurantId) return;

    joinRestaurantGroup(restaurantId);

    return () => {
      leaveRestaurantGroup(restaurantId);
    };
  }, [restaurantId, joinRestaurantGroup, leaveRestaurantGroup]);

  const residentId = sessionStorage.getItem("user_id")!;

  const { data, isLoading } = useGetRestaurantMenu(restaurantId!);
  const { data: restaurantStatus, isLoading: statusLoading } =
    useGetRestaurantAvalability(restaurantId!);

  const isAvailable = restaurantStatus?.status;

  if (isLoading || statusLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-red-100 text-red-600 p-4 rounded-full mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          {t("restaurant.status.closed")}
        </h2>
        <p className="text-muted-foreground max-w-md">
          {t("restaurant.status.deliveryUnavailable")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-40">
      <h1 className="text-2xl font-bold text-primary">
        {t("restaurant.Menu")}
      </h1>

      <div className="flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        {t("restaurant.status.open")}
      </div>

      {Array.isArray(data) &&
        data.map((category: menuData) => (
          <MenuCategory
            key={category.categoryId}
            category={category}
            restaurantId={restaurantId!}
          />
        ))}

      <CartSection residentId={residentId} restaurantId={restaurantId!} />
    </div>
  );
}