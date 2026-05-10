import { format, isToday, isYesterday, parseISO } from "date-fns";
import i18next from "i18next";

export const formatChatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const time = date.toLocaleTimeString(i18next.language, {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return time;
  }

  if (isYesterday) {
    return `${
      i18next.language === "ar" ? "أمس" : "Yesterday"
    } ${time}`;
  }

  return date.toLocaleString(i18next.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function formatLastSeen(
  dateStr?: string,
  t?: (key: string) => string
) {
  if (!dateStr) return "";

  try {
    const date = parseISO(dateStr);

    if (isToday(date)) {
      return `${t ? t("chat.lastSeenToday") : "Last seen today"}, ${format(
        date,
        "HH:mm"
      )}`;
    }

    if (isYesterday(date)) {
      return `${t ? t("chat.lastSeenYesterday") : "Last seen yesterday"}, ${format(
        date,
        "HH:mm"
      )}`;
    }

    return `${t ? t("chat.lastSeen") : "Last seen"} ${format(
      date,
      "dd MMM, HH:mm"
    )}`;
  } catch {
    return "";
  }
}