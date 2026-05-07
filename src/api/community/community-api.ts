import { toast } from "sonner";
import axiosInstance from "../axios-instance";
import { AxiosError } from "axios";
import {
  mainPostData,
  makeReportData,
  PaginationResponse,
  singleCommentData,
  toggleReactionData,
  UserPostsResponse,
} from "../../types/commuinty/community-types";

export async function AddPost(formData: FormData) {
  try {
    const response = await axiosInstance.post("Social/Post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data.message || "Added successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Added failed";
    toast.error(errorMessage);
    throw error;
  }
}

export async function editPost(formData: FormData) {
  try {
    const response = await axiosInstance.put("Social/Post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data.message || "Updated successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Updated Failed";
    toast.error(errorMessage);
    throw error;
  }
}

export async function deletePost(postId: number) {
  try {
    const response = await axiosInstance.delete(`Social/Post?postId=${postId}`);
    toast.success(response?.data?.message || "deleted successfully");
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "deleted failed";
    toast.error(errorMessage);
    throw error;
  }
}

export async function getPostsPerUser(
  userId: string,
  currentUserId: string,
  pageNumber: number = 1,
  pageSize: number = 10,
): Promise<UserPostsResponse> {
  try {
    const { data } = await axiosInstance.get(`Social/Posts/${userId}`, {
      params: {
        currentUser: currentUserId,
        pageNumber,
        pageSize,
      },
    });

    return data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Failed to fetch posts");
    throw error;
  }
}

export async function getAllPosts(
  pageNumber: number = 1,
  pageSize: number = 10,
  currentUserId: string,
): Promise<PaginationResponse<mainPostData>> {
  try {
    const { data } = await axiosInstance.get("Social/Posts", {
      params: {
        currentUserId,
        pageNumber,
        pageSize,
      },
    });

    return data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Failed to fetch posts");
    throw error;
  }
}

export async function toggleReaction(params: toggleReactionData) {
  try {
    const response = await axiosInstance.post("Social/ToggleReaction", params);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "changed failed";
    toast.error(errorMessage);
    throw error;
  }
}

export async function AddComment(
  userId: string,
  content: string,
  postId: number,
  file?: File,
) {
  try {
    const formData = new FormData();
    if (file) formData.append("file", file);

    const response = await axiosInstance.post(`Social/Comment`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      params: { userId, content, postId },
    });
    toast.success(response.data.message || "Comment added!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Failed to add comment");
    throw error;
  }
}

export async function editComment(
  content: string,
  commentId: number,
  file?: File,
) {
  try {
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    const response = await axiosInstance.put(
      `Social/Comment?commentId=${commentId}&content=${encodeURIComponent(content)}&lan=en`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    toast.success(response.data.message || "Updated successfully!");

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;

    const errorMessage = axiosError.response?.data?.message || "Update Failed";

    toast.error(errorMessage);

    throw error;
  }
}
export async function deleteComment(commentId: number) {
  try {
    const response = await axiosInstance.delete(`Social/Comment`, {
      params: { commentId },
    });
    toast.success(response.data?.message || "Comment deleted");
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(
      axiosError.response?.data?.message || "Failed to delete comment",
    );
    throw error;
  }
}

export async function getAllCommentsPerPost(
  postId: number,
  pageNumber: number = 1,
  pageSize: number = 10,
  currentUserId: string,
): Promise<PaginationResponse<singleCommentData>> {
  try {
    const { data } = await axiosInstance.get(`Social/Comments`, {
      params: { postId, currentUserId, pageNumber, pageSize },
    });
    return data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(
      axiosError.response?.data?.message || "Failed to fetch comments",
    );
    throw error;
  }
}

export async function getPostByReact(
  pageNumber: number = 1,
  pageSize: number = 10,
  userId: string,
  reactionType: number,
): Promise<PaginationResponse<mainPostData>> {
  try {
    const { data } = await axiosInstance.get("Social/Posts/ReactionType", {
      params: {
        userId,
        reactionType,
        pageNumber,
        pageSize,
      },
    });

    return data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Failed to fetch posts");
    throw error;
  }
}

export async function reportTarget(params: makeReportData) {
  try {
    const response = await axiosInstance.post("Social/Report", params);
    toast.success(response.data.message);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "report failed";
    toast.error(errorMessage);
    throw error;
  }
}
