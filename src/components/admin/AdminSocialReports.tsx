import { useState } from "react";
import { motion } from "framer-motion";
import { FaFlag, FaEye, FaEyeSlash, FaSpinner, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useGetReportsByHidden from "../../hooks/admin/useGetReportsByHidden";
import useToggleReport from "../../hooks/admin/useToggleReport";
import useDeleteReport from "../../hooks/admin/useDeleteReport";
import ReasonModal from "./Modal/ReasonModal";

const PAGE_SIZE = 10;

export default function AdminSocialReports() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openReasonModal, setOpenReasonModal] = useState(false);
  const [flag, setFlag] = useState(false);
  const [page, setPage] = useState(1);
  const adminId = sessionStorage.getItem("user_id")!;
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate: deleteReportFn, isPending: isDeleting } = useDeleteReport();

  const { data, isLoading, isError } = useGetReportsByHidden(
    page,
    PAGE_SIZE,
    flag,
  );

  const { mutate: toggle, isPending } = useToggleReport();

  const reports = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const stats = {
    total: reports.length,
    posts: reports.filter((r) => r.targetType === 1).length,
    comments: reports.filter((r) => r.targetType === 2).length,
  };

  const handleHide = (id: number, reason: string) => {
    toggle({
      id,
      adminId,
      reason,
    });

    setOpenReasonModal(false);
    setSelectedId(null);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/*  Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-2xl border border-primary/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20">
              <FaFlag className="text-2xl text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {t(flag ? "admin.hiddenReports" : "admin.activeReports")}
              </h1>
              <p className="text-muted-foreground">
                {t("admin.manageReports")}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setFlag(!flag);
              setPage(1);
            }}
            className="px-4 py-2 rounded-xl bg-primary text-white flex items-center gap-2">
            {flag ? <FaEye /> : <FaEyeSlash />}
            {t(flag ? "admin.showActive" : "admin.showHidden")}
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title={t("admin.totalReports")} value={stats.total} />
        <StatCard title={t("admin.posts")} value={stats.posts} />
        <StatCard title={t("admin.comments")} value={stats.comments} />
      </div>

      {/*  Content */}
      <div className="bg-card border border-border rounded-xl p-5">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <FaSpinner className="animate-spin text-primary text-2xl" />
          </div>
        ) : isError ? (
          <p className="text-red-500 text-center">{t("admin.errorLoading")}</p>
        ) : reports.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">{t("admin.noReports2")}</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {reports.map((item) => (
              <div
                key={item.targetId}
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
                {/*  Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-lg">
                      {item.targetType === 1
                        ? t("admin.post")
                        : t("admin.comment")}
                    </p>

                    <p className="text-sm text-muted-foreground mt-1">
                      {t("admin.reportsCount")} :{" "}
                      <span className="font-medium text-foreground">
                        {item.countReports ?? 0}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium
                    ${
                      item.targetType === 1
                        ? "bg-blue-500/10 text-blue-600"
                        : "bg-purple-500/10 text-purple-600"
                    }`}>
                    {item.targetType === 1
                      ? t("admin.post")
                      : t("admin.comment")}
                  </span>
                </div>

                {item.content && (
                  <div
                    className={`mt-3 p-3 rounded-lg border text-sm leading-relaxed
      ${
        item.targetType === 1
          ? "bg-blue-500/5 border-blue-500/10"
          : "bg-purple-500/5 border-purple-500/10"
      }`}>
                    {item.content}
                  </div>
                )}
                {/*  Media */}
                <div className="mt-4">
                  {/*  POST */}
                  {item.targetType === 1 &&
                    item.images?.filter(Boolean).length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {item.images
                          .filter(Boolean)
                          .slice(0, 4)
                          .map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              onClick={() => setPreview(img)}
                              className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:scale-[1.03] transition"
                              loading="lazy"
                            />
                          ))}

                        {item.images.length > 4 && (
                          <div className="flex items-center justify-center bg-muted rounded-lg text-sm font-medium">
                            +{item.images.length - 4}
                          </div>
                        )}
                      </div>
                    )}

                  {/* COMMENT */}
                  {item.targetType === 2 && item.image && (
                    <img
                      src={item.image}
                      loading="lazy"
                      onClick={() => setPreview(item.image)}
                      className="w-24 h-24 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
                    />
                  )}
                </div>

                {/* Reports */}
                <div className="mt-4 space-y-2">
                  {item.reports?.length ? (
                    item.reports.map((r) => (
                      <div
                        key={r.id}
                        className="p-3 rounded-lg bg-muted/40 border text-sm">
                        <p className="text-foreground">
                          {r.reason || t("admin.noReason")}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          {/*  Avatar */}
                          <img
                            src={
                              r.userReportProfile
                                ? import.meta.env.VITE_USER_IMAGE +
                                  r.userReportProfile
                                : "/fallback-user.png"
                            }
                            alt={r.userNameReport || "user"}
                            loading="lazy"
                            className="w-7 h-7 rounded-full object-cover border"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/fallback-user.png";
                            }}
                          />

                          {/*  Name */}
                          <p className="text-xs text-muted-foreground">
                            {t("admin.by")}{" "}
                            <span className="font-medium text-foreground">
                              {r.userNameReport || t("admin.unknown")}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {t("admin.noDetails")}
                    </p>
                  )}
                </div>

                {/*  Action */}
                <div className="mt-5 flex justify-end items-center gap-2">
                  {/* Hide / Restore */}
                  <button
                    disabled={isPending}
                    onClick={() => {
                      if (flag) {
                        toggle({ id: item.targetId, adminId });
                      } else {
                        setSelectedId(item.targetId);
                        setOpenReasonModal(true);
                      }
                    }}
                    className={`h-10 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition
      ${
        flag
          ? "bg-green-600/90 hover:bg-green-700 text-white"
          : "bg-red-500/90 hover:bg-red-600 text-white"
      }`}>
                    {isPending ? (
                      <FaSpinner className="animate-spin" />
                    ) : flag ? (
                      <FaEye />
                    ) : (
                      <FaEyeSlash />
                    )}
                    {flag ? t("admin.restore") : t("admin.hide")}
                  </button>

                  {/* Delete All Reports */}
                  <button
                    disabled={isDeleting}
                    onClick={() => {
                        deleteReportFn(item.targetId);
                    }}
                    className="h-10 w-10 flex items-center justify-center rounded-lg 
               bg-red-100 text-red-600 hover:bg-red-600 hover:text-white
               transition group">
                    {isDeleting ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTrash className="group-hover:scale-110 transition" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/*  Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-muted-foreground">
              {t("admin.page")} {page} {t("admin.of")} {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50">
                {t("admin.prev")}
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50">
                {t("admin.next")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
          style={{ marginTop: "0" }}>
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <img
              src={preview}
              loading="lazy"
              className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-xl"
            />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 text-white text-xl">
              ✕
            </button>
          </div>
        </div>
      )}
      <ReasonModal
        open={openReasonModal}
        loading={isPending}
        onClose={() => {
          setOpenReasonModal(false);
          setSelectedId(null);
        }}
        onSubmit={(reason) => {
          if (!selectedId) return;
          handleHide(selectedId, reason);
        }}
      />
    </div>
  );
}

/* Stat Card */
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
