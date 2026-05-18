export const serviceType = {
    doctor : 1,
    restaurant : 2,
    driver : 3,
    gym : 4
};
export const UserEvent = {
    booking : 1,
    viewDetails : 2,
    addFav : 3,
    search : 4
}
export const ReactionTargetType = {
    post : 1,
    comment: 2
}
export const ReactionType = {
    love : 1,
    save: 2
}

export const MessageType = {
    text : 1,
    file: 2,
    audio: 3,
    mixed: 4 // text + file
}
export const TechBookStatus = {
   Pending : 1,
   Accepted: 2,
   Rejected: 3,
   Cancelled : 4,
   Done: 5
}
export const RestaurantBookStatus = {
   Pending : 0,
   Accepted: 1,
   Cancelled : 2,
   Completed: 3
}

export const enum NotificationType{
        reviewScreen,
        gymPaymentSuccess,
        gymPaymentFailed,
        newRideRequest,
        rideAccepted,
        rideCancelled,
        rideCompleted,
        technicianNewBookingRequest,
        doctorCompleteInfoScreen,
        doctorBookingScreen,
        doctorEditBookingScreen,
        restaurantReservationCancelled,
        doctorCancelBookingScreen,
        messageReceived,
        driverCompleteInfoScreen,
        gymCompleteInfoScreen,
        gymPackageBooked,
        gymPackageExpired,
        gymBookingCancelled,
        residentCompleteInfoScreen,
        technicianCompleteInfoScreen,
        technicianAcceptBooking,
        technicianRejectBooking,
        userTechnicianBookingCancelled,
        technicianCancelBooking,
        postCommented,
        postReacted,
        residentCancelDoctorBooking,
        restaurantReservationAccepted,
        restaurantNewReservation,
        orderStartedPreparing,
        SocialHidden,
        orderCancelled,
        restaurantReservationUpdated,
        rideRejected
}
export const  enum PaymentStatus{
        Pending,
        Completed,
        Failed,
        Refunded
}
export const enum OrderStatus{
        Pending,
        Paid,
        Preparing,
        OnTheWay,
        Delivered,
        Cancelled
}