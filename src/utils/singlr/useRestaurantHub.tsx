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

// ─── Types ────────────────────────────────────────────────────────────────────
interface RestaurantHubContextValue {
  joinRestaurantGroup: (restaurantId: string) => Promise<void>;
  leaveRestaurantGroup: (restaurantId: string) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const RestaurantHubContext = createContext<RestaurantHubContextValue | null>(
  null
);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function RestaurantHubProvider({
  token,
  children,
}: {
  token: string;
  children: ReactNode;
}) {
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connectionRef = useRef<any>(null);
  // Queue group joins that happen before the connection is ready
  const pendingJoinsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!token) return;

    const connection = createHubConnection(
      "https://waslammka.runasp.net/restaurantHub",
      token
    );
    connectionRef.current = connection;

    // ── Event Handlers ────────────────────────────────────────────────────────

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueriesData(
        { queryKey: ["cart"] },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      queryClient.setQueriesData(
        { queryKey: ["cart"] },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // ── Start Connection then flush pending joins ──────────────────────────────
    connection
      .start()
      .then(async () => {
        console.log("✅ Connected to restaurantHub");

        // Flush any joinRestaurantGroup calls that came in before connection was ready
        for (const id of pendingJoinsRef.current) {
          try {
            await connection.invoke("JoinRestaurantGroup", id);
            console.log(`✅ Joined restaurant group: ${id}`);
          } catch (err) {
            console.error(`❌ Failed to join group ${id}:`, err);
          }
        }
        pendingJoinsRef.current = [];
      })
      .catch((err) => console.error("❌ restaurantHub connection failed:", err));

    return () => {
      connection.stop();
      connectionRef.current = null;
    };
  }, [token, queryClient]);

  // ─── Group Methods ───────────────────────────────────────────────────────────

  const joinRestaurantGroup = useCallback(async (restaurantId: string) => {
    const conn = connectionRef.current;

    if (!conn) {
      // Connection not created yet — queue it
      pendingJoinsRef.current.push(restaurantId);
      return;
    }

    if (conn.state === signalR.HubConnectionState.Connected) {
      try {
        await conn.invoke("JoinRestaurantGroup", restaurantId);
        console.log(`✅ Joined restaurant group: ${restaurantId}`);
      } catch (err) {
        console.error(`❌ Failed to join group ${restaurantId}:`, err);
      }
    } else {
      // Connection exists but not yet Connected — queue it
      pendingJoinsRef.current.push(restaurantId);
    }
  }, []);

  const leaveRestaurantGroup = useCallback(async (restaurantId: string) => {
    const conn = connectionRef.current;

    if (conn?.state === signalR.HubConnectionState.Connected) {
      try {
        await conn.invoke("LeaveRestaurantGroup", restaurantId);
        console.log(`✅ Left restaurant group: ${restaurantId}`);
      } catch (err) {
        console.error(`❌ Failed to leave group ${restaurantId}:`, err);
      }
    }

    // Remove from pending queue if it was never joined
    pendingJoinsRef.current = pendingJoinsRef.current.filter(
      (id) => id !== restaurantId
    );
  }, []);

  return (
    <RestaurantHubContext.Provider
      value={{ joinRestaurantGroup, leaveRestaurantGroup }}
    >
      {children}
    </RestaurantHubContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useRestaurantHubContext() {
  const ctx = useContext(RestaurantHubContext);
  if (!ctx) {
    throw new Error(
      "useRestaurantHubContext must be used inside RestaurantHubProvider"
    );
  }
  return ctx;
}