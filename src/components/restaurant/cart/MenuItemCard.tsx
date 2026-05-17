import { useState } from "react";
import { useTranslation } from "react-i18next";
import { itemsData } from "../../../types/restaurant/restaurant-types";
import useAddToCart from "../../../hooks/restaurant/cart/useAddToCart";

export default function MenuItemCard({
  item,
  restaurantId,
}: {
  item: itemsData;
  restaurantId: string;
}) {
  const { t } = useTranslation();
  const [qty, setQty] = useState(1);
  const { mutate, isPending } = useAddToCart();
  const residentId = sessionStorage.getItem("user_id")!;
  const hasDiscount = item.discountPrice > 0;

  const handleAddToCart = () => {
    mutate(
      {
        menuItemId: item.id,
        residentId,
        restaurantId,
        quantity: qty,
      },
      {
        onSuccess: () => {
          setQty(1);
        },
      },
    );
  };

  return (
    <>
      {item.isAvailable || !item.isDeleted ? (
        <div className="flex flex-col sm:flex-row gap-3 border border-border rounded-xl p-3 bg-background shadow-sm hover:shadow-md transition">
          {/* Image */}
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-lg"
          />

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Top */}
            <div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">
                {item.name}
              </h3>

              <p className="text-xs text-dried">
                {item.preparationTime} {t("restaurant.min")}
              </p>
            </div>

            {/* Bottom */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-2">
              {/* Price */}
              <div>
                {hasDiscount ? (
                  <>
                    <span className="text-primary font-bold text-sm">
                      {item.discountPrice} {t("restaurant.egp")}
                    </span>
                    <span className="line-through text-dried text-xs ml-2">
                      {item.price}
                    </span>
                  </>
                ) : (
                  <span className="text-primary font-bold text-sm">
                    {item.price} {t("restaurant.egp")}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-2">
                {/* Quantity */}
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-2 py-1 text-primary">
                    -
                  </button>

                  <span className="px-2 text-sm">{qty}</span>

                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-2 py-1 text-primary">
                    +
                  </button>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!item.isAvailable || isPending}
                  className={`
    px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-colors duration-200
    ${
      !item.isAvailable
        ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 cursor-not-allowed"
        : "bg-primary text-white hover:opacity-90"
    }
    ${isPending ? "opacity-70" : ""}
  `}>
                  {!item.isAvailable
                    ? t("restaurant.unavailable")
                    : isPending
                      ? t("restaurant.adding")
                      : t("restaurant.add")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
