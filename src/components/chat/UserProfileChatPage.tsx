import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiPhone, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useGetUserProfile, useUpdateBio } from "../../hooks/chat/useChat";
import { CHAT_ROUTES } from "../../routes/ChatRoutes";
import ChatProfileSettings from "./ChatProfileSettings";
import { toast } from "sonner";
import { FaArrowRight } from "react-icons/fa";
import { formatLastSeen } from "../../utils/chatUtils";

export default function UserProfileChatPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const currentUserId = sessionStorage.getItem("user_id") || "";
  const isMe = userId === currentUserId;

  const { data: profile, isLoading } = useGetUserProfile(userId || "");
  const { mutate: saveBio, isPending } = useUpdateBio();

  const [editingBio, setEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState("");

  const handleSaveBio = () => {
    if (!userId) return;
    if (bioValue.length > 25) {
      toast.error(t("chat.longBio"));
      return;
    }
    saveBio(
      { userId, bio: bioValue },
      { onSuccess: () => setEditingBio(false) },
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4 border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full hover:bg-border transition flex items-center justify-center">
          <FiArrowLeft size={18} />
        </button>

        <h2 className="text-base font-semibold">{t("chat.profile")}</h2>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center gap-4 pt-10 pb-6 px-6">
        {profile?.profileImage ? (
          <img
            src={profile.profileImage}
            alt={profile.name || ""}
            loading="lazy"
            className="w-28 h-28 rounded-full object-cover ring-4 ring-primary/20"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-border flex items-center justify-center ring-4 ring-border">
            <FiUser size={40} className="text-dried" />
          </div>
        )}

        <div className="text-center">
          <h3 className="text-xl font-bold">
            {profile?.name || t("chat.unknownUser")}
          </h3>

          {profile?.isOnline ? (
            <p className="text-sm text-green-500 mt-1 font-medium">
              ● {t("chat.online")}
            </p>
          ) : profile?.lastSeen ? (
            <p className="text-xs text-dried mt-1">
              {formatLastSeen(profile.lastSeen, t)}
            </p>
          ) : null}

          {profile?.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="flex items-center gap-1 text-sm text-dried mt-1 justify-center hover:text-primary transition">
              <FiPhone size={13} />
              {profile.phone}
            </a>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="mx-4 p-4 border border-border rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-dried uppercase tracking-wider">
            {t("chat.bio")}
          </span>

          {isMe && !editingBio && (
            <button
              onClick={() => {
                setBioValue(profile?.bio || "");
                setEditingBio(true);
              }}
              className="text-primary hover:opacity-70 transition">
              <FiEdit2 size={14} />
            </button>
          )}
        </div>

        {editingBio ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={bioValue}
              onChange={(e) => setBioValue(e.target.value)}
              rows={3}
              maxLength={160}
              className="w-full bg-background rounded-xl px-3 py-2 text-sm outline-none border border-border resize-none"
              placeholder={t("chat.writeBio")}
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingBio(false)}
                className="text-xs text-dried hover:text-foreground transition px-3 py-1.5 rounded-lg hover:bg-border">
                {t("chat.cancel")}
              </button>

              <button
                onClick={handleSaveBio}
                disabled={isPending}
                className="text-xs bg-primary text-white px-4 py-1.5 rounded-lg hover:opacity-80 transition disabled:opacity-50">
                {isPending ? t("chat.saving") : t("chat.save")}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-dried">
            {profile?.bio || (isMe ? t("chat.addBio") : t("chat.noBio"))}
          </p>
        )}
      </div>

      {/* Start Chat */}
      {!isMe && (
        <div className="px-4 mt-4">
          <button
            onClick={() =>
              navigate(CHAT_ROUTES.conversation(profile?.id || ""))
            }
            className="w-full py-3 rounded-2xl bg-primary text-white font-semibold text-sm hover:opacity-85 transition">
            {t("chat.message")}
          </button>
        </div>
      )}

      {/* Theme + Language */}
      {isMe && <ChatProfileSettings />}
      {isMe && (
        <div className="mb-4 mt-4">
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="w-[80%] m-auto mb-2 px-6 py-3 rounded-full border border-[#2f3336] text-sky-500 hover:bg-white/10 transition font-bold flex justify-center items-center gap-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}>
            <FaArrowRight /> {t("common.back")}
          </motion.button>
        </div>
      )}
    </div>
  );
}
