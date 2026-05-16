import CategoriesSection from "./common/CategorySection";
import ItemsSection from "./common/ItemSection";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import useGetRestaurantAvalability from "../../hooks/restaurant/useGetRestaurantAvalability";
import useChangeRestaurantAvalibitly from "../../hooks/restaurant/useChangeRestaurantAvalability";

export default function RestaurantMenuDashboard() {
  const { t } = useTranslation();
  const restaurantId = sessionStorage.getItem("user_id")!;

  const [tab, setTab] = useState<"items" | "categories">("items");

  // get current status
  const { data, isLoading } =
    useGetRestaurantAvalability(restaurantId);

  // toggle status
  const { mutate, isPending } =
    useChangeRestaurantAvalibitly();

  const isAvailable = data?.status;
  console.log(isAvailable)
  if (!restaurantId)
    return (
      <div className="p-8 text-center text-dried">
        {t("restaurant.menu.loading")}
      </div>
    );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-primary bg-clip-text">
          {t("restaurant.menu.dashboard")}
        </h2>
      </div>

      {/* RESTAURANT STATUS CARD */}
      <div className="w-full rounded-2xl border border-border bg-background p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {t("restaurant.status.title")}
            </h3>

            <p className="text-sm text-muted-foreground mt-1">
              {isAvailable
                ? t("restaurant.status.availableDesc")
                : t("restaurant.status.busyDesc")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* STATUS BADGE */}
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isLoading
                ? t("restaurant.status.loading")
                : isAvailable
                ? t("restaurant.status.open")
                : t("restaurant.status.closed")}
            </div>

            {/* TOGGLE BUTTON */}
            <button
              disabled={isPending}
              onClick={() => mutate()}
              className={`px-5 py-2 rounded-xl text-white font-medium transition-all duration-200 ${
                isAvailable
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } disabled:opacity-70`}
            >
              {isPending
                ? t("restaurant.status.updating")
                : isAvailable
                ? t("restaurant.status.stopOrders")
                : t("restaurant.status.startOrders")}
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 p-1 rounded-xl border border-border w-fit">
        <button
          onClick={() => setTab("items")}
          className={`px-4 py-2 rounded-lg transition ${
            tab === "items"
              ? "bg-primary text-white shadow"
              : "text-foreground"
          }`}
        >
          {t("restaurant.menu.items")}
        </button>

        <button
          onClick={() => setTab("categories")}
          className={`px-4 py-2 rounded-lg transition ${
            tab === "categories"
              ? "bg-primary text-white shadow"
              : "text-foreground"
          }`}
        >
          {t("restaurant.menu.categories")}
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-4">
        {tab === "items" && (
          <ItemsSection restaurantId={restaurantId} />
        )}

        {tab === "categories" && (
          <CategoriesSection restaurantId={restaurantId} />
        )}
      </div>
    </div>
  );
}