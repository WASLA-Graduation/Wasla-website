import { Outlet, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ChatList from "./ChatList";

export default function ChatLayout() {
  const { receiverId } = useParams();
  const location = useLocation();
  const { t } = useTranslation();

  const isNewChatPage = location.pathname.includes("/chat/new");
  const isProfilePage = location.pathname.includes("/chat/profile");

  const showChat = receiverId || isNewChatPage || isProfilePage;

  return (
    <div className="flex h-screen overflow-x-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`
          flex flex-col
          w-full lg:max-w-[350px]
          md:max-w-[250px]
          shrink-0
          border-r border-border
          bg-background
          transition-all duration-300
          ${showChat ? "hidden md:flex" : "flex"}
        `}>
        <ChatList />
      </aside>

      {/* Main */}
      <main
        className={`
          flex flex-col flex-1
          bg-background
          transition-all duration-300
          ${showChat ? "flex" : "hidden md:flex"}
        `}>
        {showChat ? (
          <Outlet />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 select-none text-dried p-6">
            {/* icon */}
            <div className="opacity-60">
              <svg width="72" height="72" viewBox="0 0 64 64" fill="none">
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M20 26h24M20 34h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* text */}
            <p className="text-base font-semibold tracking-wide text-center max-w-xs">
              {t("chat.selectChatToStart")}
            </p>

            {/* hint */}
            <p className="text-sm opacity-60 text-center">
              {t("chat.startConversationHint")}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
