import { notificationData } from "../../types/notifications/notification-types";
import { getNotificationAction } from "../../utils/notification-handler";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import useMarkNotifyAsRead from "../../hooks/notifications/useMarkNotifyAsRead";
import useDeleteNotify from "../../hooks/notifications/useDeleteNotify";
import { FiTrash2, FiCheck, FiChevronLeft } from "react-icons/fi";
import { MdCircle } from "react-icons/md";
import incomeImage from "../../assets/images/income.png";
import i18next from "i18next";
import { useState } from "react";

export default function NotificationCard({
  notification,
}: {
  notification: notificationData;
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const { mutate: markAsRead, isPending: marking } = useMarkNotifyAsRead();
  const { mutate: deleteNotify, isPending: deleting } = useDeleteNotify();

  const action = getNotificationAction(
    notification.type,
    notification.referenceId,
  );

  const handleClick = () => {
    if (!notification.isSeen) {
      markAsRead(notification.id);
    }

    if (action.type === "navigate" && action.path) {
      navigate(action.path);
    }

    if (action.type === "external" && action.url) {
      window.open(action.url, "_blank");
    }

    if (action.type === "modal") {
      console.log("Open modal with:", action.url);
    }
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return i18next.language === "en" ? "Now" : "الآن";
    if (diffMins < 60)
      return i18next.language === "en"
        ? `from ${diffMins} m`
        : `منذ ${diffMins} د`;
    if (diffHours < 24)
      return i18next.language === "en"
        ? `from ${diffHours} h`
        : `منذ ${diffHours} س`;
    if (diffDays < 7)
      return i18next.language === "en"
        ? `from ${diffDays} d`
        : `منذ ${diffDays} يوم`;
    return created.toLocaleDateString("ar-EG");
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        // Base styles
        "group relative p-3 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer",
        "bg-background text-foreground border-border",
        "hover:shadow-lg hover:-translate-y-[2px] active:scale-[0.98]",
        // Unread styles
        !notification.isSeen && [
          "border-primary/30 bg-primary/[0.03] shadow-md",
          "before:absolute before:right-0 before:top-0 before:bottom-0 before:w-1",
          "before:bg-primary before:rounded-l-full",
        ],
      )}>
      <div className="flex gap-3 items-start">
        {/* Image with badge */}
        <div className="relative shrink-0">
          <img
            src={notification.imageUrl ?? incomeImage}
            loading="lazy"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-border group-hover:border-primary/30 transition-colors"
            alt={notification.title}
          />

          {/* Online/Unread indicator */}
          {!notification.isSeen && (
            <span className="absolute -top-1 -right-1">
              <MdCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary drop-shadow-md" />
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className={clsx(
                "font-semibold text-sm sm:text-base transition-colors",
                expanded ? "whitespace-normal" : "truncate",
                !notification.isSeen
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}>
              {notification.title}
            </h4>

            {/* Time - visible on mobile */}
            <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
              {timeAgo(notification.createdAt)}
            </span>
          </div>

          {/* Body */}
          <p
            className={clsx(
              "text-xs sm:text-sm leading-relaxed break-words",
              expanded ? "line-clamp-none" : "line-clamp-2",
              !notification.isSeen
                ? "text-foreground/80"
                : "text-muted-foreground/70",
            )}>
            {notification.body}
          </p>

          {/* Footer - Actions */}
          <div className="flex items-center justify-between mt-2">
            {/* Action buttons - visible on hover */}
            <div
              className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => e.stopPropagation()}>
              {!notification.isSeen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification.id);
                  }}
                  disabled={marking}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-500/10 text-green-600 transition-all hover:scale-110 disabled:opacity-50"
                  title="mark as read">
                  <FiCheck size={14} className="sm:w-4 sm:h-4" />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotify(notification.id);
                }}
                disabled={deleting}
                className="p-1.5 sm:p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-500/10 text-red-500 transition-all hover:scale-110 disabled:opacity-50"
                title="حذف">
                <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Chevron indicator */}
            <FiChevronLeft
              size={14}
              className={clsx(
                "text-muted-foreground/40 transition-all duration-300",
                "group-hover:text-primary group-hover:-translate-x-1",
                "sm:w-4 sm:h-4",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
