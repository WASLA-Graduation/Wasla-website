import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useMemo, useState } from "react";
import useGetRestaurantCharts from "../../hooks/restaurant/useGetRestaurantCharts";

export default function RestaurantCharts() {
  const { t } = useTranslation();
  const resId = sessionStorage.getItem("user_id")!;
  const { data, isLoading } = useGetRestaurantCharts(resId);

  const [year, setYear] = useState<number | null>(null);

  const { availableYears, chartData, insights } = useMemo(() => {
    if (!data?.years)
      return {
        availableYears: [],
        chartData: [],
        insights: null,
      };

    const monthsList = [1,2,3,4,5,6,7,8,9,10,11,12];

    const years = data.years.map((y) => y.year);
    const selectedYear = year ?? years[years.length - 1];

    const selectedData =
      data.years.find((y) => y.year === selectedYear)?.months || [];

    const finalMonths = monthsList.map((month) => {
      const match = selectedData.find((m) => m.month === month);
      return { name: month, amount: match ? match.amount : 0 };
    });

    // 🔥 Insights Logic
    const total = finalMonths.reduce((acc, m) => acc + m.amount, 0);

    const maxMonth = finalMonths.reduce((prev, curr) =>
      curr.amount > prev.amount ? curr : prev
    );

    const minMonth = finalMonths.reduce((prev, curr) =>
      curr.amount < prev.amount ? curr : prev
    );

    const avg = total / 12;

    return {
      availableYears: years,
      chartData: finalMonths,
      insights: {
        total,
        maxMonth,
        minMonth,
        avg,
      },
    };
  }, [data, year]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      title: t("restaurant.reservations"),
      value: data?.numberOfReservations || 0,
    },
    {
      title: t("restaurant.order"),
      value: data?.numOfOrders || 0,
    },
    {
      title: t("restaurant.completedOrders"),
      value: data?.numOfCompletedOrders || 0,
    },
    {
      title: t("restaurant.totalRevenue"),
      value: `${data?.totalAmount || 0} ${t("restaurant.egp")}`,
    },
  ];

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold ml-4 mr-4">
          {t("restaurant.Dashboard")}
        </h1>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-primary rounded-2xl p-6 shadow hover:shadow-xl transition"
          >
            <h3 className="text-dried text-sm">{s.title}</h3>
            <p className="text-2xl font-bold text-primary mt-2">
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div
        className="border border-primary rounded-xl p-6 shadow space-y-4"
        style={{ direction: "ltr" }}
      >
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h2 className="text-xl font-bold">
            {t("restaurant.revenueChart")}
          </h2>

          <select
            value={year ?? ""}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-primary px-3 py-2 rounded-lg bg-background"
          >
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="techRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                  <stop offset="85%" stopColor="var(--primary)" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--primary)"
                fill="url(#techRev)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {insights && (
  <div className="grid md:grid-cols-4 gap-4">
    {[
      {
        label: t("restaurant.totalYearRevenue"),
        value: insights.total,
        color: "text-primary",
      },
      {
        label: t("restaurant.bestMonth"),
        value: `${t(`months.${insights.maxMonth.name}`)} (${insights.maxMonth.amount})`,
        color: "text-green-600",
      },
      {
        label: t("restaurant.worstMonth"),
        value: `${t(`months.${insights.minMonth.name}`)} (${insights.minMonth.amount})`,
        color: "text-red-500",
      },
      {
        label: t("restaurant.average"),
        value: Math.round(insights.avg),
        color: "text-blue-500",
      },
    ].map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: i * 0.15,
          type: "spring",
          stiffness: 120,
        }}
        whileHover={{
          scale: 1.05,
          rotate: 0.5,
          boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
        }}
        className="p-5 border rounded-xl shadow bg-background cursor-pointer"
      >
        <p className="text-sm text-gray-500">{item.label}</p>
        <p className={`text-xl font-bold mt-2 ${item.color}`}>
          {item.value}
        </p>
      </motion.div>
    ))}
  </div>
)}
    </div>
  );
}