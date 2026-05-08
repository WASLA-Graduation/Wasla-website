import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useGetChatUsers } from "../../hooks/chat/useChat";
import { CHAT_ROUTES } from "../../routes/ChatRoutes";

export default function NewChatPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userId = sessionStorage.getItem("user_id")!;
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetChatUsers(1, 50);

  const users = data?.data ?? [];

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) && u.id != userId ,
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4 border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full hover:bg-border transition flex items-center justify-center">
          <FiArrowLeft size={18} />
        </button>

        <h2 className="text-base font-semibold">{t("chat.newChat")}</h2>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-primary/40 transition">
          <FiSearch className="text-dried shrink-0" size={15} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("chat.searchUsers")}
            className="bg-transparent text-sm w-full outline-none placeholder:text-dried"
          />
        </div>
      </div>

      {/* Users */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center mt-16 opacity-70">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 gap-2 text-dried">
            <FiUser size={26} className="opacity-40" />

            <p className="text-sm">{t("chat.noUsersFound")}</p>
          </div>
        ) : (
          filtered.map((user) => (
            <button
              key={user.id}
              onClick={() => navigate(CHAT_ROUTES.conversation(user.id))}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-border/40 transition">
              {/* avatar */}
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || ""}
                  loading="lazy"
                  className="w-11 h-11 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-border flex items-center justify-center shrink-0">
                  <FiUser size={18} className="text-dried" />
                </div>
              )}

              {/* info */}
              <div className="text-left min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user.name || t("chat.unknownUser")}
                </p>

                {user.bio && (
                  <p className="text-xs text-dried truncate">{user.bio}</p>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
