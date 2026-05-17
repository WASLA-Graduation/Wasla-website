export const restaurantKeys = {
  cart: (residentId: string, restaurantId: string) => [
    "cart",
    residentId,
    restaurantId,
  ],

  restaurantMenu: (restaurantId: string) => [
    "restaurant-menu",
    restaurantId,
  ],

  itemMenu: (restaurantId: string, page: number, size: number) => [
    "item-menu",
    restaurantId,
    page,
    size,
  ],

  categoryMenu: (restaurantId: string) => [
    "category-menu",
    restaurantId,
  ],

  restaurantStatus: (restaurantId: string) => [
    "restaurant-status",
    restaurantId,
  ],
};