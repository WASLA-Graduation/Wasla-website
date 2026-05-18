/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createHubConnection } from "./HubConnection";
import { toast } from "sonner";
import i18next from "i18next";

export default function useRestaurantHub(token: string) {
  const queryClient = useQueryClient();
  const connectionRef = useRef<any>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const timer = setTimeout(() => {
      const connection = createHubConnection(
        "https://waslammka.runasp.net/restaurantHub",
        token
      );

      connectionRef.current = connection;

      connection.start().then(() => {
        console.log("Connected to restaurantHub");

        // ✅ لو في restaurantId محفوظ، انضم للمجموعة
        if (restaurantId) {
          connection.invoke("JoinRestaurantGroup", restaurantId);
          console.log("Joined restaurant group:", restaurantId);
        }
      });

      // ... كل الـ handlers هنا زي ما هما ...

      connection.on("MenuItemAdded", (data) => {
        console.log("🔔 MenuItemAdded received:", data); // ✅ أضف log للتأكيد
        queryClient.invalidateQueries({ queryKey: ["item-menu"] });
        queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });

        toast.success(
          `${i18next.t("restaurant.newItemAdded")}: ${data.name.ar || data.name.en}`
        );
      });

      connection.on("MenuItemUpdated", (data) => {
        console.log("🔔 MenuItemUpdated received:", data); // ✅ أضف log للتأكيد
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

      // ... باقي الـ handlers ...

      connection.on("MenuItemDeleted", (data) => {
        console.log("🔔 MenuItemDeleted received:", data); // ✅ أضف log للتأكيد
        queryClient.invalidateQueries({ queryKey: ["item-menu"] });
        queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });

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
    }, 3000);

    return () => {
      clearTimeout(timer);
      connectionRef.current?.stop();
    };
  }, [token, queryClient, restaurantId]);

  // ✅ دالة للانضمام للمطعم (تتصل من صفحة المنيو)
  const joinRestaurantGroup = async (id: string) => {
    setRestaurantId(id);
    if (connectionRef.current) {
      await connectionRef.current.invoke("JoinRestaurantGroup", id);
      console.log("Manually joined restaurant group:", id);
    }
  };

  const leaveRestaurantGroup = async (id: string) => {
    setRestaurantId(null);
    if (connectionRef.current) {
      await connectionRef.current.invoke("LeaveRestaurantGroup", id);
      console.log("Left restaurant group:", id);
    }
  };

  return {
    joinRestaurantGroup,
    leaveRestaurantGroup,
  };
}