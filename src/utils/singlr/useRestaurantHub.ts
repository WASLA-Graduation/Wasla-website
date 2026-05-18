/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/singlr/useRestaurantHub.ts
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createHubConnection } from "./HubConnection";
import { toast } from "sonner";
import i18next from "i18next";

export default function useRestaurantHub(token: string) {
  const queryClient = useQueryClient();
  const connectionRef = useRef<any>(null);

  useEffect(() => {
    if (!token) return;

    const connection = createHubConnection("/restaurantHub", token);
    connectionRef.current = connection;

    connection.start().then(() => {
      console.log("Connected to restaurantHub");
    });

    connection.on("RestaurantStatusChanged", (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-status"] });
      queryClient.invalidateQueries({
        queryKey: ["restaurant-menu", data.restaurantId.toString()],
        exact: false,
      });

      const statusText = data.isAvailable
        ? i18next.t("restaurant.nowAvailable")
        : i18next.t("restaurant.nowUnavailable");

      toast.info(statusText);
    });

    connection.on("MenuItemAdded", (data) => {
      queryClient.invalidateQueries({ queryKey: ["item-menu"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });

      toast.success(
        `${i18next.t("restaurant.newItemAdded")}: ${data.name.ar || data.name.en}`
      );
    });

    connection.on("MenuItemUpdated", (data) => {
      queryClient.invalidateQueries({ queryKey: ["item-menu"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });

      queryClient.setQueriesData(
        { queryKey: ["cart"] },
        (old: any[] | undefined) =>
          old?.map((item) =>
            item.menuItemId === data.id
              ? {
                  ...item,
                  price: data.price,
                  isAvailable: data.isAvailable,
                  name: data.name,
                  imageUrl: data.imageUrl,
                }
              : item
          )
      );

      toast.info(i18next.t("restaurant.itemUpdated"));
    });

    connection.on("MenuItemStatusChanged", (data) => {
      queryClient.invalidateQueries({ queryKey: ["item-menu"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });

      queryClient.setQueriesData(
        { queryKey: ["cart"] },
        (old: any[] | undefined) =>
          old?.map((item) =>
            item.menuItemId === data.menuItemId
              ? { ...item, isAvailable: data.isAvailable }
              : item
          )
      );

      const statusText = data.isAvailable
        ? i18next.t("restaurant.itemNowAvailable")
        : i18next.t("restaurant.itemNowUnavailable");

      toast.info(statusText);
    });

    connection.on("MenuItemDeleted", (data) => {
      queryClient.invalidateQueries({ queryKey: ["item-menu"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });

      // تعليم العنصر كمحذوف في الكارت (بدل حذفه نهائياً)
      queryClient.setQueriesData(
        { queryKey: ["cart"] },
        (old: any[] | undefined) =>
          old?.map((item) =>
            item.menuItemId === data.menuItemId
              ? { ...item, isDeleted: true, isAvailable: false }
              : item
          )
      );

      toast.warning(i18next.t("restaurant.itemDeleted"), {
        description: i18next.t("restaurant.itemRemovedFromCart"),
      });
    });

    return () => {
      connection.stop();
    };
  }, [token, queryClient]);

  const joinRestaurantGroup = async (restaurantId: string) => {
    if (connectionRef.current) {
      await connectionRef.current.invoke("JoinRestaurantGroup", restaurantId);
    }
  };

  const leaveRestaurantGroup = async (restaurantId: string) => {
    if (connectionRef.current) {
      await connectionRef.current.invoke("LeaveRestaurantGroup", restaurantId);
    }
  };

  return {
    joinRestaurantGroup,
    leaveRestaurantGroup,
  };
}