import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import image1 from "../../assets/images/collprate.jpg";
import image2 from "../../assets/images/booking.jpg";
import image3 from "../../assets/images/ride.jpg";
import image4 from "../../assets/images/chat.jpg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
export default function HeroSection() {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const slides = [
    {
      id: 1,
      title: t("hero.connect"),
      desc: t("hero.connectDesc"),
      image: image1,
    },
    {
      id: 2,
      title: t("hero.book"),
      desc: t("hero.bookDesc"),
      image: image2,
    },
    {
      id: 3,
      title: t("hero.smart"),
      desc: t("hero.smartDesc"),
      image: image3,
    },
    {
      id: 4,
      title: t("hero.stay"),
      desc: t("hero.stayDesc"),
      image: image4,
    },
  ];

  return (
    <section id="home" className="relative w-full min-h-[90vh] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 3700, disableOnInteraction: false }}
        loop
        className="h-full">
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative w-full h-[100vh] bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url(${slide.image})` }}>
              <div className="absolute inset-0 bg-black/50" />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center text-white px-6 md:px-12">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
                  {slide.desc}
                </p>

                <div className="flex justify-center gap-3 mt-6">
                  <button 
                  onClick={()=> navigate("/dashboard")}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-all font-medium text-base"
                  >
                    {t("hero.explore")}
                  </button>
                  <button 
                  className="px-5 py-2.5 border border-white text-white rounded-lg hover:bg-white/10 transition-all font-medium text-base"
                  onClick={()=> navigate("/auth/login")}
                  >
                    {t("hero.join")}
                  </button>
                </div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
