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
        {/* auto delete notice */}
        <div className="px-3 pt-3">
          <div className="overflow-hidden rounded-2xl border border-border bg-muted/40 backdrop-blur">
            <div className="flex items-start gap-3 p-4">
              {/* icon */}
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>

              {/* content */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {t("chat.temporaryChats")}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {t("chat.messagesAutoDelete")}
                </p>
              </div>
            </div>

            {/* bottom line */}
            <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
          </div>
        </div>

        {/* chats */}
        <div className="min-h-0 flex-1">
          <ChatList />
        </div>
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
