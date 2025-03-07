import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Post, SavedVideo, Group, User, DiaryEntry } from "@/types";

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Posts state
  posts: Post[];
  isPostsLoading: boolean;
  postsError: string | null;

  // Videos state
  savedVideos: SavedVideo[];
  isVideosLoading: boolean;
  videosError: string | null;

  // Groups state
  groups: Group[];
  isGroupsLoading: boolean;
  groupsError: string | null;

  // Diary entries state
  diaryEntries: DiaryEntry[];
  isDiaryLoading: boolean;
  diaryError: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Post actions
  addPost: (post: Post) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  deletePost: (postId: string) => void;
  setPosts: (posts: Post[]) => void;

  // Video actions
  addVideo: (video: SavedVideo) => void;
  deleteVideo: (videoId: string) => void;
  setVideos: (videos: SavedVideo[]) => void;

  // Group actions
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  setGroups: (groups: Group[]) => void;

  // Diary actions
  addDiaryEntry: (entry: DiaryEntry) => void;
  deleteDiaryEntry: (entryId: string) => void;
  setDiaryEntries: (entries: DiaryEntry[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      posts: [],
      isPostsLoading: false,
      postsError: null,

      savedVideos: [],
      isVideosLoading: false,
      videosError: null,

      groups: [],
      isGroupsLoading: false,
      groupsError: null,

      diaryEntries: [],
      isDiaryLoading: false,
      diaryError: null,

      // User actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Post actions
      addPost: (post) => {
        try {
          set((state) => ({ posts: [post, ...state.posts] }));
        } catch (error) {
          set({ postsError: "Failed to add post" });
        }
      },
      likePost: (postId) => {
        try {
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                    isLiked: !post.isLiked,
                  }
                : post
            ),
          }));
        } catch (error) {
          set({ postsError: "Failed to like post" });
        }
      },
      addComment: (postId, comment) => {
        try {
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    comments: [...post.comments, comment],
                  }
                : post
            ),
          }));
        } catch (error) {
          set({ postsError: "Failed to add comment" });
        }
      },
      deletePost: (postId) => {
        try {
          set((state) => ({
            posts: state.posts.filter((post) => post.id !== postId),
          }));
        } catch (error) {
          set({ postsError: "Failed to delete post" });
        }
      },
      setPosts: (posts) => set({ posts, isPostsLoading: false }),

      // Video actions
      addVideo: (video) => {
        try {
          set((state) => ({
            savedVideos: [video, ...state.savedVideos],
          }));
        } catch (error) {
          set({ videosError: "Failed to save video" });
        }
      },
      deleteVideo: (videoId) => {
        try {
          set((state) => ({
            savedVideos: state.savedVideos.filter(
              (video) => video.id !== videoId
            ),
          }));
        } catch (error) {
          set({ videosError: "Failed to delete video" });
        }
      },
      setVideos: (videos) =>
        set({ savedVideos: videos, isVideosLoading: false }),

      // Group actions
      joinGroup: (groupId) => {
        try {
          set((state) => ({
            groups: state.groups.map((group) =>
              group.id === groupId
                ? {
                    ...group,
                    isJoined: true,
                    members: group.members + 1,
                  }
                : group
            ),
          }));
        } catch (error) {
          set({ groupsError: "Failed to join group" });
        }
      },
      leaveGroup: (groupId) => {
        try {
          set((state) => ({
            groups: state.groups.map((group) =>
              group.id === groupId
                ? {
                    ...group,
                    isJoined: false,
                    members: group.members - 1,
                  }
                : group
            ),
          }));
        } catch (error) {
          set({ groupsError: "Failed to leave group" });
        }
      },
      setGroups: (groups) => set({ groups, isGroupsLoading: false }),

      // Diary actions
      addDiaryEntry: (entry) => {
        try {
          set((state) => ({
            diaryEntries: [entry, ...state.diaryEntries],
          }));
        } catch (error) {
          set({ diaryError: "Failed to save diary entry" });
        }
      },
      deleteDiaryEntry: (entryId) => {
        try {
          set((state) => ({
            diaryEntries: state.diaryEntries.filter(
              (entry) => entry.id !== entryId
            ),
          }));
        } catch (error) {
          set({ diaryError: "Failed to delete diary entry" });
        }
      },
      setDiaryEntries: (entries) =>
        set({ diaryEntries: entries, isDiaryLoading: false }),
    }),
    {
      name: "mental-health-app-storage",
      partialize: (state) => ({
        user: state.user,
        posts: state.posts,
        savedVideos: state.savedVideos,
        groups: state.groups,
        diaryEntries: state.diaryEntries,
      }),
    }
  )
);
