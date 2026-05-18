import { NotificationType } from "./enum";

export interface NotificationAction {
  type: "navigate" | "external" | "modal";
  path?: string;
  url?: string;
  label?: string;
}
export function getNotificationAction(
  type: NotificationType,
  referenceId: string
): NotificationAction {
  switch (type) {
    /** ---------------- COMMUNITY ---------------- */
    case NotificationType.postReacted:
    case NotificationType.postCommented:
      return {
        type: "navigate",
        path: `/community/profile/me`,
        label: "View Post",
      };

    /** ---------------- REVIEWS ---------------- */
    case NotificationType.reviewScreen:
      return {
        type: "navigate",
        path: window.location.pathname.replace("notifications", "reviews"),
        label: "View Review",
      };

    /** ---------------- GYM ---------------- */
    case NotificationType.gymPaymentSuccess:
      return {
        type: "external",
        url: referenceId,
        label: "Show QR Code",
      };

    case NotificationType.gymPaymentFailed:
      return {
        type: "navigate",
        path: `/resident/payment-failed`,
        label: "Retry Payment",
      };

    case NotificationType.gymPackageBooked:
      return {
        type: "navigate",
        path: `/gym/dashboard`,
        label: "View Package",
      };

    case NotificationType.gymPackageExpired:
      return {
        type: "navigate",
        path: `/gym/dashboard`,
        label: "Renew Package",
      };

    case NotificationType.gymBookingCancelled:
      return {
        type: "navigate",
        path: `/gym/dashboard`,
        label: "View Bookings",
      };

    case NotificationType.gymCompleteInfoScreen:
      return {
        type: "navigate",
        path: `/gym/profile`,
        label: "Complete Info",
      };

    /** ---------------- TECHNICIAN ---------------- */
    case NotificationType.technicianNewBookingRequest:
    case NotificationType.technicianAcceptBooking:
    case NotificationType.technicianRejectBooking:
    case NotificationType.technicianCancelBooking:
    case NotificationType.userTechnicianBookingCancelled:
      return {
        type: "navigate",
        path: `/technician/overView`,
        label: "View Booking",
      };

    case NotificationType.technicianCompleteInfoScreen:
      return {
        type: "navigate",
        path: `/technician/profile`,
        label: "Complete Info",
      };

    /** ---------------- DOCTOR ---------------- */
    case NotificationType.doctorBookingScreen:
    case NotificationType.doctorEditBookingScreen:
    case NotificationType.doctorCancelBookingScreen:
      return {
        type: "navigate",
        path: `/doctor/manage-dashboard`,
        label: "View Booking",
      };

    case NotificationType.doctorCompleteInfoScreen:
      return {
        type: "navigate",
        path: `/doctor/profile`,
        label: "Complete Info",
      };

    /** ---------------- RESIDENT ---------------- */
    case NotificationType.residentCompleteInfoScreen:
      return {
        type: "navigate",
        path: `/resident/profile`,
        label: "Complete Info",
      };

    case NotificationType.residentCancelDoctorBooking:
      return {
        type: "navigate",
        path: `/resident/profile/my-bookings`,
        label: "Complete Info",
      };
      
    case NotificationType.orderStartedPreparing:
      return {
        type: "navigate",
        path: `/resident/profile/my-bookings`,
        label: "Complete Info",
      };
      
    /** ---------------- RESTAURANT ---------------- */
    case NotificationType.restaurantReservationAccepted:
      return {
        type: "navigate",
        path: `/resident/profile/my-bookings`,
        label: "Complete Info",
      };

    case NotificationType.restaurantNewReservation:
      return {
        type: "navigate",
        path: `/restaurant/orders`,
        label: "Complete Info",
      };
      

    /** ---------------- CHAT ---------------- */
    case NotificationType.messageReceived:
      return {
        type: "navigate",
        path: `/chat`,
        label: "Open Chat",
      };

    /** ---------------- DEFAULT ---------------- */
    default:
      return {
        type: "navigate",
        path: window.location.pathname.replace("notifications", "notifications"),
        label: "View Details",
      };
  }
}