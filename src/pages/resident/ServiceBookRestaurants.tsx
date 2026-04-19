import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { FaHeart } from "react-icons/fa";
import useFetchAllRestaurants from "../../hooks/restaurant/useFetchAllRestaurants";
import useGetRestaurantSpecial from "../../hooks/restaurant/useGetRestaurantSpecial";
import { useGetFavourites } from "../../hooks/resident/favourites/useGetFavourite";
import { useAddToFavourite } from "../../hooks/resident/favourites/useAddToFavourite";
import { useRemoveFavourite } from "../../hooks/resident/favourites/useRemoveFavourite";
import useCreateEvent from "../../hooks/userEvent/useCreateEvent";
import { UserEvent } from "../../utils/enum";

import noData from "../../assets/images/nodata.webp";

export default function RestaurantsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(0);
  const [page, setPage] = useState(1);

  const userId = sessionStorage.getItem("user_id")!;
  const createEvent = useCreateEvent();

  // categories
  const { data: categories } = useGetRestaurantSpecial();

  // restaurants
  const { data, isLoading } = useFetchAllRestaurants(
    page,
    6,
    selectedCategory ?? 0
  );

  const restaurants = data?.data || [];

  // favourites
  const { data: favourites = [] } = useGetFavourites(userId);
  const addFav = useAddToFavourite(userId);
  const removeFav = useRemoveFavourite(userId);

  const isFav = (id: string) =>
    favourites.find(
      (f: { serviceProviderId: string }) => f.serviceProviderId === id
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">

      <Swiper spaceBetween={10} slidesPerView="auto" className="mb-6">
        <SwiperSlide style={{ width: "auto" }}>
          <button
            onClick={() => {
              setSelectedCategory(0);
              setPage(1);
            }}
            className={`px-5 py-2 rounded-2xl transition ${
              selectedCategory === 0
                ? "bg-primary text-white shadow"
                : "bg-dried text-white"
            }`}
          >
            {t("resident.All")}
          </button>
        </SwiperSlide>

        {categories?.map((cat) => (
          <SwiperSlide key={cat.id} style={{ width: "auto" }}>
            <button
              onClick={() => {
                setSelectedCategory(cat.id);
                setPage(1);
              }}
              className={`px-5 py-2 rounded-2xl transition ${
                selectedCategory === cat.id
                  ? "bg-primary text-white shadow"
                  : "bg-dried text-white"
              }`}
            >
              {cat.name}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {isLoading ? (
        <p className="text-center">{t("restaurant.loading")}...</p>
      ) : restaurants.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((res) => (
              <div
                key={res.id}
                className="rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={res.profile}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  <button
                    onClick={() => {
                      const fav = isFav(res.id);
                      if (fav) removeFav.mutate(fav.id);
                      else addFav.mutate(res.id);
                    }}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
                  >
                    <FaHeart
                      className={
                        isFav(res.id)
                          ? "text-red-500"
                          : "text-gray-400"
                      }
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold line-clamp-1">
                      {res.name}
                    </h3>

                    <p className="text-primary text-sm">
                      {t("restaurant.category")}
                    </p>

                    <p className="text-gray-500 text-sm mt-1 line-clamp-6">
                      {res.description}
                    </p>

                    <p className="text-sm mt-5">
                      📞 {res.phoneNumber}
                    </p>
                  </div>

                  {/* Button */}
                  <button
                    className="bg-primary text-white py-2 rounded-lg hover:opacity-90 transition"
                    onClick={() => {
                      createEvent.mutate(
                        {
                          userId: userId,
                          serviceProviderId: res.id,
                          eventType: UserEvent.viewDetails,
                        },
                        {
                          onSettled: () => navigate(`${res.id}`),
                        }
                      );
                    }}
                  >
                    {t("resident.ViewDetails")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/*  Pagination */}
          <div className="flex justify-center mt-10 gap-3 items-center">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-dried text-white rounded disabled:opacity-50"
            >
              {t("tech.prev")}
            </button>

            <span className="px-4 py-2 font-semibold">
              {data?.currentPage}
            </span>

            <button
              disabled={page >= Math.ceil((data?.totalCount || 0) / 6)}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-dried text-white rounded disabled:opacity-50"
            >
              {t("tech.next")}
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center mt-10">
          <img src={noData} className="w-60 opacity-80" />
        </div>
      )}
    </div>
  );
}