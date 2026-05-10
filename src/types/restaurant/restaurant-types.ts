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

export interface updateReservationData{
    reservationId: number,
    numberOfPersons: number,
    reservationDate: string,
    reservationTime: string,
}

export interface reversationDashboardData{
    id: number,
    userId: string,
    profile: string,
    name:string,
    phone: string, //photo
    numberOfPersons: number,
    reservationDate: string,
    reservationTime: string,
    status: number
}
export interface addCategoryMenuData {
    name: {
    english: string,
    arabic: string
  },
  restaurantId: string
}
export interface editCategoryMenuData {
    id: number
    name: {
    english: string,
    arabic: string
  },
}
export interface categoryMenuData {
    id: number,
    name: {
        english: string,
        arabic: string
    },
    nameValue: string,
    restaurantId: string
}
export interface itemMenuData{
    id: number,
    name: {
        english: string,
        arabic: string
    },
    nameValue: string,
    categoryName: string,
    price: number,
    discountPrice: number,
    imageUrl: string,
    preparationTime: number, 
    isAvailable: boolean,
    restaurantId: string,
    categoryId: number
}
export interface MonthData {
  month: number;
  amount: number;
}
export interface restaurantChartsData {
  numberOfReservations: number;
  numOfOrders: number;
  numOfCompletedOrders: number;
  totalAmount: number;
  years: {
    year: number;
    months: MonthData[];
  }[];
}

export interface itemsData{
    id: number,
    name: string,
    price: number,
    discountPrice: number,
    imageUrl: string,
    preparationTime: number,
    isAvailable: boolean
}
export interface menuData{
    categoryId: number,
    categoryName: string,
    items : itemsData[]
}
export interface addToCartData{
  menuItemId: number,
  residentId: string,
  restaurantId: string,
  quantity: number
}
export interface cartData{
    cartItemId: number,
    menuItemId: number,
    menuItemName: string,
    menuItemCategoryName: string,
    imageUrl: string,
    quantity: number,
    totalPrice: number
}
export interface checkoutData{
    restaurantId: string,
    residentId: string,
    address: string,
    notes: string,
    paymentMethod: number
}
export interface itemOrder {
    menuItemId : number,
    orderItemId: number,
    orderItemName: string,
    price: number,
    quantity: number
}
export interface residentTakeAway{
    id: number,
    restaurantId: string,
    restaurantName: string,
    totalPrice: number,
    address: string,
    notes: string,
    deliveryFee: number,
    status: number,
    paymentStatus: number,
    paymentMethod: number,
    createdAt: string,
    items: itemOrder[]
}
export interface restaurantTakeAway{
    id: number,
    residentId: string,
    residentName: string,
    residentPhone : string,
    totalPrice: number,
    address: string,
    notes: string,
    deliveryFee: number,
    status: number,
    paymentStatus: number,
    paymentMethod: number,
    createdAt: string,
    items: itemOrder[]
}