import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import useBookingHub from "./utils/singlr/useBookingHub";
import useServiceHub from "./utils/singlr/useServiceHub";
import useReviewHub from "./utils/singlr/useReviewHub";
import { ChatHubProvider } from "./utils/singlr/ChatHubConnection";
import useReservationHub from "./utils/singlr/useReservationHub";
import useRestaurantHub from "./utils/singlr/useRestaurantHub";

const queryClient = new QueryClient();

function App() {
  const token = localStorage.getItem("auth_token") ?? "";
  const userId = sessionStorage.getItem("user_id") ?? "";

  return (
    <QueryClientProvider client={queryClient}>
      <SignalRListener token={token} />
      <ChatHubProvider token={token} currentUserId={userId}>
      <AppRoutes />
      </ChatHubProvider>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}

export default App;

function SignalRListener({ token }: { token: string }) {
  useBookingHub(token);
  useServiceHub(token);
  useReviewHub(token);
  useReservationHub(token);
  useRestaurantHub(token)

  return null;
}