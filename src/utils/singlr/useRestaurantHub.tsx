// src/utils/singlr/RestaurantHubContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createHubConnection } from "./HubConnection";
import { toast } from "sonner";
import i18next from "i18next";
import * as signalR from "@microsoft/signalr";

interface RestaurantHubContextValue {
  joinRestaurantGroup: (restaurantId: string) => Promise<void>;
  leaveRestaurantGroup: (restaurantId: string) => Promise<void>;
}

const RestaurantHubContext = createContext<RestaurantHubContextValue | null>(null);

export function RestaurantHubProvider({
  token,
  children,
}: {
  token: string;
  children: ReactNode;
}) {
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const restaurantConnRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const menuConnRef = useRef<any>(null);
  const pendingJoinsRef = useRef<string[]>([]);

  // ─── restaurantHub — RestaurantStatusChanged only ───────────────────────────
  useEffect(() => {
    if (!token) return;

    const conn = createHubConnection(
      "https://waslammka.runasp.net/restaurantHub",
      token
    );
    restaurantConnRef.current = conn;

    conn.on("RestaurantStatusChanged", (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-status"] });
      queryClient.invalidateQueries({
        queryKey: ["restaurant-menu", data.restaurantId.toString()],
        exact: false,
      });
      toast.info(
        data.isAvailable
          ? i18next.t("restaurant.nowAvailable")
          : i18next.t("restaurant.nowUnavailable")
      );
    });

    conn
      .start()
      .then(() => console.log("✅ Connected to restaurantHub"))
      .catch((err) => console.error("❌ restaurantHub failed:", err));

    return () => {
      conn.stop();
      restaurantConnRef.current = null;
    };
  }, [token, queryClient]);

  // ─── menuHub — MenuItem events ──────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;

    const conn = createHubConnection(
      "https://waslammka.runasp.net/menuHub",
      token
    );
    menuConnRef.current = conn;

    conn.on("MenuItemAdded", () => {
      queryClient.invalidateQueries({ queryKey: ["item-menu"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });
      toast.success(
        `${i18next.t("restaurant.newItemAdded")}`
      );
    });

    conn.on("MenuItemUpdated", (data) => {
      queryClient.invalidateQueries({ queryKey: ["item-menu"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueriesData({ queryKey: ["cart"] }, (old: any[] | undefined) =>
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

    conn.on("MenuItemStatusChanged", (data) => {
      queryClient.invalidateQueries({ queryKey: ["item-menu"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueriesData({ queryKey: ["cart"] }, (old: any[] | undefined) =>
        old?.map((item) =>
          item.menuItemId === data.menuItemId
            ? { ...item, isAvailable: data.isAvailable }
            : item
        )
      );
      toast.info(
        data.isAvailable
          ? i18next.t("restaurant.itemNowAvailable")
          : i18next.t("restaurant.itemNowUnavailable")
      );
    });

    conn.on("MenuItemDeleted", (data) => {
      queryClient.invalidateQueries({ queryKey: ["item-menu"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueriesData({ queryKey: ["cart"] }, (old: any[] | undefined) =>
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

    conn
      .start()
      .then(async () => {
        console.log("✅ Connected to menuHub");
        // flush any pending joins that arrived before connection was ready
        for (const id of pendingJoinsRef.current) {
          try {
            await conn.invoke("JoinRestaurantGroup", id);
            console.log(`✅ menuHub joined group: ${id}`);
          } catch (err) {
            console.error(`❌ menuHub join failed for ${id}:`, err);
          }
        }
        pendingJoinsRef.current = [];
      })
      .catch((err) => console.error("❌ menuHub failed:", err));

    return () => {
      conn.stop();
      menuConnRef.current = null;
    };
  }, [token, queryClient]);

  // ─── Group Methods — على menuHub فقط ────────────────────────────────────────
  const joinRestaurantGroup = useCallback(async (restaurantId: string) => {
    const conn = menuConnRef.current;

    if (!conn) {
      pendingJoinsRef.current.push(restaurantId);
      return;
    }

    if (conn.state === signalR.HubConnectionState.Connected) {
      try {
        await conn.invoke("JoinRestaurantGroup", restaurantId);
        console.log(`✅ menuHub joined group: ${restaurantId}`);
      } catch (err) {
        console.error(`❌ menuHub join failed:`, err);
      }
    } else {
      pendingJoinsRef.current.push(restaurantId);
    }
  }, []);

  const leaveRestaurantGroup = useCallback(async (restaurantId: string) => {
    const conn = menuConnRef.current;

    if (conn?.state === signalR.HubConnectionState.Connected) {
      try {
        await conn.invoke("LeaveRestaurantGroup", restaurantId);
        console.log(`✅ menuHub left group: ${restaurantId}`);
      } catch (err) {
        console.error(`❌ menuHub leave failed:`, err);
      }
    }

    pendingJoinsRef.current = pendingJoinsRef.current.filter(
      (id) => id !== restaurantId
    );
  }, []);

  return (
    <RestaurantHubContext.Provider value={{ joinRestaurantGroup, leaveRestaurantGroup }}>
      {children}
    </RestaurantHubContext.Provider>
  );
}

export function useRestaurantHubContext() {
  const ctx = useContext(RestaurantHubContext);
  if (!ctx) {
    throw new Error("useRestaurantHubContext must be used inside RestaurantHubProvider");
  }
  return ctx;
}