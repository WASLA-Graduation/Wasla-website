// src/utils/singlr/useReservationHub.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createHubConnection } from "./HubConnection";

export default function useReservationHub(token: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) return;

    const connection = createHubConnection(
      "/reservationHub", 
      token
    );

    connection.start().then(() => {
      console.log("Connected to reservationHub");
    });

    connection.on("ReservationCreated", (data) => {
      console.log("New reservation created:", data);
      queryClient.invalidateQueries({ 
        queryKey: ["table-booking"], 
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["reversation-book"], 
        exact: false 
      });
    });

    connection.on("ReservationStatusChanged", (data) => {
      console.log("Reservation status changed:", data);
      queryClient.invalidateQueries({ 
        queryKey: ["table-booking"], 
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["reversation-book"], 
        exact: false 
      });
    });

    connection.on("ReservationUpdated", (data) => {
      console.log("Reservation updated:", data);
      queryClient.invalidateQueries({ 
        queryKey: ["table-booking"], 
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["reversation-book"], 
        exact: false 
      });
    });

    return () => {
      connection.stop();
    };
  }, [token, queryClient]);
}