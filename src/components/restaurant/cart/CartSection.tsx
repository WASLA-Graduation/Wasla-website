import useGetCart from "../../../hooks/restaurant/cart/useGetCart";
import useRemoveFromCart from "../../../hooks/restaurant/cart/useRemoveFromCart";
import useEditCart from "../../../hooks/restaurant/cart/useEditItemCart";
import { useTranslation } from "react-i18next";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import CheckoutModal from "./modal/CheckoutModal";

export default function CartSection({
  residentId,
  restaurantId,
}: {
  residentId: string;
  restaurantId: string;
}) {
  const { data } = useGetCart(residentId, restaurantId);
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromCart();
  const { mutate: editItem, isPending: isEditing } = useEditCart();
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [invalidItems, setInvalidItems] = useState<any[]>([]);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);

  const [open, setOpen] = useState(false);

  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleCheckout = () => {
    const unavailable = data.filter(
      (item) => item.isDeleted || !item.isAvailable,
    );

    if (unavailable.length > 0) {
      setInvalidItems(unavailable);
      setShowUnavailableModal(true);
      return;
    }

    setOpen(true);
  };

  return (
    <>
      <div
        className="
fixed bottom-2 sm:bottom-4 
left-1/2 -translate-x-1/2 
w-[95%] sm:max-w-2xl 
bg-background/95 backdrop-blur 
border border-border 
rounded-xl sm:rounded-2xl 
p-3 sm:p-4 
shadow-2xl z-50
">
        <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
          {data.map((item) => (
            <div
              key={item.cartItemId}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <img
                  src={item.imageUrl}
                  loading="lazy"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded object-cover"
                />

                <div>
                  <p className="text-sm font-semibold">{item.menuItemName}</p>

                  <p className="text-xs text-dried">
                    {item.totalPrice} {t("restaurant.egp")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between sm:ml-auto gap-2">
                {/* Quantity */}
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    disabled={isEditing || item.quantity <= 1}
                    onClick={() =>
                      editItem({
                        cartItemId: item.cartItemId,
                        residentId,
                        quantity: item.quantity - 1,
                      })
                    }
                    className="px-2 py-1 text-primary disabled:opacity-50">
                    -
                  </button>

                  <span className="px-2 text-sm">{item.quantity}</span>

                  <button
                    disabled={isEditing}
                    onClick={() =>
                      editItem({
                        cartItemId: item.cartItemId,
                        residentId,
                        quantity: item.quantity + 1,
                      })
                    }
                    className="px-2 py-1 text-primary disabled:opacity-50">
                    +
                  </button>
                </div>

                {/* Delete */}
                <button
                  disabled={isRemoving}
                  onClick={() =>
                    removeItem({
                      cartItemId: item.cartItemId,
                      residentId,
                    })
                  }
                  className="text-red-500 text-lg disabled:opacity-50">
                  <MdDeleteOutline />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center mt-3 pt-3 border-t border-border">
          <span className="font-bold text-base sm:text-lg text-center sm:text-left">
            {total} {t("restaurant.egp")}
          </span>

          <button
            onClick={handleCheckout}
            className="bg-primary text-white w-full sm:w-auto px-5 py-2 rounded-lg hover:scale-[1.02] transition">
            {t("restaurant.checkout")}
          </button>
        </div>
      </div>
      <CheckoutModal
        open={open}
        onClose={() => setOpen(false)}
        residentId={residentId}
        restaurantId={restaurantId}
      />
      {showUnavailableModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        style={{marginTop :"0"}}
        >
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* icon */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>

            {/* title */}
            <h2 className="text-center text-lg font-bold">
              {t("restaurant.unavailableItems")}
            </h2>

            {/* subtitle */}
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {t("restaurant.unavailableItemsDesc")}
            </p>

            {/* items */}
            <div className="mt-5 space-y-2">
              {invalidItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center justify-between rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3">
                  <span className="text-sm font-medium">
                    {item.menuItemName}
                  </span>

                  <span className="rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-500">
                    {item.isDeleted
                      ? t("restaurant.removed")
                      : t("restaurant.unavailable")}
                  </span>
                </div>
              ))}
            </div>

            {/* actions */}
            <button
              onClick={() => setShowUnavailableModal(false)}
              className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-medium text-white transition hover:opacity-90">
              {t("common.ok")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
