export interface showAllRestaurants{
     id: string,
    name: string,
    description: string,
    phoneNumber: string,
    ownerName: string,
    restaurantCategoryId: number,
    profile: string,
    gallery: string[]
}
export interface restaurantDetailsData{
    email: string,
    restaurantCategoryName: string,
    id: string,
    name: string,
    description: string,
    phoneNumber: string,
    ownerName: string,
    restaurantCategoryId: number,
    profile: string,
    gallery: string[]
}
export interface addTableData {
    userId: string,
    restaurantId: string,
    numberOfPersons: number,
    reservationDate: string,
    reservationTime: string
}

export interface reversationData{
    id: number,
    restaurantId: string,
    numberOfPersons: number,
    restaurantName: string,
    restaurantProfile: string,
    restaurantPhone: string,
    reservationDate: string,
    reservationTime: string,
    status: number
}
export interface reversationDashboardData{
    id: number,
    userId: string,
    profile: string,
    phone: string, //photo
    numberOfPersons: number,
    reservationDate: string,
    reservationTime: string,
    status: number
}