import { useState, useEffect, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { SlLogout } from "react-icons/sl";
import {
  FaSun,
  FaMoon,
  FaGlobe,
  FaBars,
  FaTimes,
  FaSnowflake,
  FaInbox,
} from "react-icons/fa";
import {
  FaCommentSms,
  FaUserShield,
  FaUsers,
} from "react-icons/fa6";
import { GrServices } from "react-icons/gr";
import { MdDashboard, MdReport , MdAdminPanelSettings } from "react-icons/md";
import logo from "../../assets/images/icons/app-logo.png";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import useLogout from "../../hooks/auth/useLogout";

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useContext(ThemeContext);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mutate: logout, isPending } = useLogout();
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme) setTheme(savedTheme);
  }, [setTheme]);

  const toggleLanguage = () => {
    const lang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("applang", lang);
  };

  const toggleTheme = () => {
    const next =
      theme === "light"
        ? "dark"
        : theme === "dark"
        ? "warm"
        : theme === "warm"
        ? "cold"
        : "light";
    setTheme(next);
    localStorage.setItem("appTheme", next);
  };

  const handleLogout = () => logout();

 const navItems = [
  {
    label: t("admin.dashboard"),
    link: "/admin/overview",
    icon: <MdDashboard />,
  },
  {
    label: t("admin.users"),
    link: "/admin/manage-users",
    icon: <FaUsers />,
  },
  {
    label: t("admin.serv"),
    link: "/admin/services-overview",
    icon: <GrServices />,
  },
  {
    label: t("admin.viewers"),
    link: "/admin/viewers-messages",
    icon: <FaCommentSms />,
  },
  {
    label: t("admin.reports"),
    link: "/admin/reports",
    icon: <MdReport />,
  },

  ...(role === "superadmin"
    ? [
        {
          label: t("admin.adminsControl"),
          link: "/admin/admins-control",
          icon: <MdAdminPanelSettings />,
        },
      ]
    : []),
  ...(role === "admin"
    ? [
      { label: t("common.chat"), link: "/chat", icon: <FaInbox /> },
      ]
    : []),
];

  const themeIcon = (th : string) => {
    switch (th) {
      case "dark":
        return <FaMoon />;
      case "warm":
        return <FaSun />;
      case "cold":
        return <FaSnowflake />;
      default:
        return <FaSun />;
    }
  };

  return (
    <div className="flex h-screen">
      <aside
        className={`border-r border-border flex flex-col justify-between transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } hidden md:flex`}
      >
        <div>
          <div className="flex items-center gap-3 p-4">
            <img
              src={logo}
              alt="Logo"
              loading="lazy"
              className={`w-10 h-10 ${sidebarOpen ? "block" : "hidden"}`}
            />
            {sidebarOpen && (
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FaUserShield className="text-primary" />
                {t("admin.panel")}
              </h3>
            )}
          </div>

          <nav className="flex flex-col mt-6 gap-2 px-3">
            {navItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.link}
                className={({ isActive }) =>
                  `
                  group flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                  ${
                    isActive
                      ? sidebarOpen
                        ? "bg-primary text-white font-semibold"
                        : "bg-primary text-white w-10 h-10"
                      : "text-foreground hover:bg-primary/10 hover:text-primary"
                  }
                `
                }
              >
                <span className="text-xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span
                  className={`transition-all duration-300 ${
                    sidebarOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-3 w-0 overflow-hidden"
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10"
          >
            <FaGlobe />
            {sidebarOpen && <span>{i18n.language.toUpperCase()}</span>}
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10"
          >
            {themeIcon(theme)}
            {sidebarOpen && <span>{theme}</span>}
          </button>

          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-2 p-2 rounded-md text-red-500 hover:bg-red-500/10"
          >
            <SlLogout />
            {sidebarOpen && (
              <span>{isPending ? t("nav.logged...") : t("nav.Logout")}</span>
            )}
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center p-2 mt-2 rounded-md hover:bg-primary/10"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 flex justify-end"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="w-3/4 bg-background h-full p-6 border-l border-border flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <button
                  className="absolute top-4 right-4 text-xl"
                  onClick={() => setMobileOpen(false)}
                >
                  <FaTimes />
                </button>

                <div className="flex items-center gap-2 mb-10 mt-6">
                  <img src={logo} loading="lazy" className="w-10 h-10" />
                  <h3 className="text-lg font-semibold">{t("admin.panel")}</h3>
                </div>

                <div className="flex flex-col gap-6">
                  {navItems.map((item, i) => (
                    <NavLink
                      key={i}
                      to={item.link}
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium hover:text-primary"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-border pt-6">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-primary/10"
                >
                  <FaGlobe className="text-primary" />
                  {i18n.language.toUpperCase()}
                </button>

                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-primary/10"
                >
                  {themeIcon(theme)}
                  {theme}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500 text-white"
                >
                  <SlLogout />
                  {t("nav.Logout")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className="md:hidden fixed top-4 left-4 z-50 text-2xl"
        onClick={() => setMobileOpen(true)}
      >
        <FaBars />
      </button>

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
